"""A Tour of TopoGym -- the executable companion to the blog post.

Every figure in the post is produced here, against the public API of the
installed ``topogym`` wheel (0.3.0) -- except section 10, which needs the
repository checkout on PYTHONPATH (the EpicChase k-sweep ids and the
comparison module are newer than the wheel). Figures are named ``sNN_*``
after the post section they appear in. Everything but the benchmark sweep
(section 9, a random policy over the 189 hold-out worlds, ~20 min and
cached) and the single-layout study (section 10, ~10 s) runs in about a
minute.

    python demos.py                # everything, into ./figures
    python demos.py 1 2 5          # a subset, by the numbers in DEMOS

Environment variables:

    TOPOGYM_SPLITS   path to a TopoGym checkout's docs/splits (demo 9);
                     the wheel does not ship the split CSVs.
    TOPOGYM_REPO     path to a TopoGym checkout (outro: croissant.json).
    DEMO9_EPISODES   random-policy episodes per hold-out world (default 50).
"""

from __future__ import annotations

import hashlib
import json
import os
import pathlib
import shutil
import sys
import time

import gymnasium as gym
import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib import colors as mcolors  # noqa: E402

import topogym  # noqa: E402,F401  (registers the TopoGym/* ids)
from topogym import benchmarks  # noqa: E402
from topogym.rendering import tiles  # noqa: E402
from topogym.rendering.rgb import render_rgb_2d  # noqa: E402
from topogym.stats import StatsRecorder  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
FIG = HERE / "figures"
FIG.mkdir(exist_ok=True)
OUT: dict = {}  # printed outputs, quoted verbatim in the post
T0 = time.time()

# ----------------------------------------------------------------------------
# figure plumbing: every matplotlib figure is saved twice, once per theme,
# with a transparent background so it sits on the site's own surface.
# ----------------------------------------------------------------------------

THEMES = {
    "light": {"text": "#18181b", "muted": "#52525b", "grid": "#d8d8dd",
              "accent": "#3a5bd9", "accent2": "#d9643a", "accent3": "#2a9d8f"},
    "dark": {"text": "#f4f4f5", "muted": "#b4b4bd", "grid": "#34343c",
             "accent": "#7c93f5", "accent2": "#f5a07c", "accent3": "#5fd1c2"},
}

BASE_RC = {
    "svg.fonttype": "path",
    "font.family": "DejaVu Sans",
    "font.size": 9,
    "axes.titlesize": 10,
    "axes.labelsize": 9,
    "legend.fontsize": 8,
    "xtick.labelsize": 8,
    "ytick.labelsize": 8,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "legend.frameon": False,
    "figure.facecolor": "none",
    "axes.facecolor": "none",
    "savefig.facecolor": "none",
    "savefig.transparent": True,
    "savefig.bbox": "tight",
    "savefig.pad_inches": 0.05,
}


def themed_rc(theme: str) -> dict:
    t = THEMES[theme]
    return {
        **BASE_RC,
        "text.color": t["text"],
        "axes.labelcolor": t["text"],
        "axes.titlecolor": t["text"],
        "axes.edgecolor": t["muted"],
        "xtick.color": t["muted"],
        "ytick.color": t["muted"],
        "grid.color": t["grid"],
        "legend.labelcolor": t["text"],
    }


def save(build, name: str) -> None:
    """``build(theme) -> Figure``; writes ``figures/<name>_{light,dark}.svg``."""
    for theme in THEMES:
        with plt.rc_context(themed_rc(theme)):
            fig = build(theme)
            fig.savefig(FIG / f"{name}_{theme}.svg", format="svg")
            if os.environ.get("REVIEW_PNG"):
                review = pathlib.Path(os.environ["REVIEW_PNG"])
                review.mkdir(exist_ok=True)
                fig.savefig(review / f"{name}_{theme}.png", dpi=110, transparent=False,
                            facecolor="#ffffff" if theme == "light" else "#141418")
            plt.close(fig)
    print(f"  wrote {name}_{{light,dark}}.svg  [{time.time() - T0:5.1f}s]")


def show_world(ax, img: np.ndarray, title: str | None = None) -> None:
    ax.imshow(img, interpolation="nearest")
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)
    if title:
        ax.set_title(title, fontsize=9)


def world(env_id_or_env, tile: int = 6, reveal: bool = True, **kw):
    """Make (or take) an env, reset it, and return (core, rgb image)."""
    if isinstance(env_id_or_env, str):
        env = gym.make(env_id_or_env, reveal_hidden=reveal, **kw)
        env.reset(seed=0)
    else:
        env = env_id_or_env
    core = env.unwrapped
    return core, render_rgb_2d(core, tile=tile)


def paint(img: np.ndarray, base, cells, color, tile: int, strength: float) -> None:
    """Tint a set of cells on a rendered world, in place (tiles.tint)."""
    for cell in cells:
        x, y = base.layout_coords(tuple(cell))
        tiles.tint(img[y * tile:(y + 1) * tile, x * tile:(x + 1) * tile],
                   color, strength)


def grey(img: np.ndarray, amount: float = 0.55) -> np.ndarray:
    """A desaturated, dimmed copy of a rendered world -- a backdrop."""
    lum = img.astype(np.float32).mean(axis=2, keepdims=True)
    out = lum * (1 - amount) + 255 * amount * 0.35
    return np.repeat(out, 3, axis=2).astype(np.uint8)


def record(key: str, value) -> None:
    OUT[key] = value
    text = value if isinstance(value, str) else json.dumps(value, indent=2, default=str)
    print(f"--- {key}\n{text}")


# ----------------------------------------------------------------------------
# 1. Hello, certified world
# ----------------------------------------------------------------------------

def demo01():
    env = gym.make("TopoGym/Grid2D-v0", base="torus", size=17, n_holes=2,
                   n_chambers=1, n_decoys=1, layout_seed=7)
    obs, info = env.reset(seed=0)
    topo = info["topology"]
    record("demo01_topology", {
        "base_map": topo["base_map"],
        "betti_z2": topo["betti_z2"],
        "betti_z2_sealed": topo["betti_z2_sealed"],
        "homology": topo["homology"],
        "euler_characteristic": topo["euler_characteristic"],
        "orientable": topo["orientable"],
        "genus": topo["genus"],
        "n_bridges": topo["connectivity"]["n_bridges"],
        "certified": topo["certified"],
        "n_free_cells": topo["n_free_cells"],
    })

    gallery = [
        ("Grid2D: torus, 2 holes", dict(id="TopoGym/Grid2D-v0", base="torus",
                                        size=17, n_holes=2, n_chambers=1,
                                        n_decoys=1, layout_seed=7), 12),
        ("Decoys4-50", dict(id="TopoGym/Decoys4-50-v0"), 5),
        ("Nested3-50", dict(id="TopoGym/Nested3-50-v0"), 5),
        ("Bottleneck3-100", dict(id="TopoGym/Bottleneck3-100-v0"), 3),
        ("TopKlein-50", dict(id="TopoGym/TopKlein-50-v0"), 5),
    ]
    panels = []
    for label, kw, tile in gallery:
        kw = dict(kw)
        env_id = kw.pop("id")
        core, img = world(env_id, tile=tile, reveal=True, **kw)
        m = core.topology
        extra = (f"genus {m.genus}" if m.genus is not None
                 else f"demigenus {m.demigenus}")
        cap = (f"{label}\nb = {list(m.betti_z2)}  sealed {list(m.betti_z2_sealed)}"
               f"\nH1 = {m.homology['H1']}, {extra}")
        panels.append((img, cap))
    record("demo01_gallery", [c for _, c in panels])

    def build(theme):
        fig, axes = plt.subplots(1, len(panels), figsize=(11.5, 3.3))
        for ax, (img, cap) in zip(axes, panels):
            show_world(ax, img)
            ax.set_xlabel(cap, fontsize=7.5, labelpad=6)
        fig.subplots_adjust(wspace=0.18)
        return fig
    save(build, "s01_gallery")


# ----------------------------------------------------------------------------
# 2. Determinism as a feature
# ----------------------------------------------------------------------------

def demo02():
    import subprocess

    env_id = "TopoGym/Maze-50-v0"

    def make(seed):
        env = gym.make(env_id, seed=seed)
        _, info = env.reset(seed=0)
        return render_rgb_2d(env.unwrapped, tile=6), info["topology"]

    # The second seed=4 render comes from a *separate interpreter*, so the
    # comparison is across processes, not within one.
    child = (
        "import sys, numpy as np, gymnasium as gym, topogym\n"
        "from topogym.rendering.rgb import render_rgb_2d\n"
        f"env = gym.make({env_id!r}, seed=4); env.reset(seed=0)\n"
        "np.save(sys.argv[1], render_rgb_2d(env.unwrapped, tile=6))\n"
    )
    other = FIG / "_s09_other_process.npy"
    subprocess.run([sys.executable, "-c", child, str(other)], check=True)
    a, ta = make(4)
    b = np.load(other)
    other.unlink()
    c, tc = make(5)
    sha = lambda img: hashlib.sha256(img.tobytes()).hexdigest()  # noqa: E731
    record("demo02", {
        "world": env_id,
        "pixel_identical_across_processes": bool(np.array_equal(a, b)),
        "pixels_differ_seed_plus_one": bool((a != c).any()),
        "sha256": {"seed4_this_process": sha(a), "seed4_other_process": sha(b),
                   "seed5": sha(c)},
        "betti": {"seed4": ta["betti_z2"], "seed5": tc["betti_z2"]},
        "optimal_actions": {"seed4": None, "seed5": None},
    })

    def build(theme):
        fig, axes = plt.subplots(1, 3, figsize=(10, 3.9))
        for ax, img, title in zip(axes, (a, b, c), (
                "seed=4, this process", "seed=4, another process", "seed=5")):
            show_world(ax, img, title)
            ax.set_xlabel(f"sha256 {sha(img)[:16]}…", fontsize=7.5,
                          family="monospace", labelpad=6)
        fig.subplots_adjust(wspace=0.06)
        return fig
    save(build, "s09_triptych")


# ----------------------------------------------------------------------------
# 3. What the agent actually sees
# ----------------------------------------------------------------------------

def demo03():
    from topogym.core import constants as C
    from topogym import FORWARD, TURN_LEFT

    kw = dict(base="torus", size=17, n_holes=2, n_chambers=1, n_decoys=1,
              layout_seed=7)
    ego = gym.make("TopoGym/Grid2D-v0", **kw)           # local 7x7, Discrete(3)
    obs, _ = ego.reset(seed=0)
    for a in (FORWARD, FORWARD, TURN_LEFT, FORWARD):
        obs, *_ = ego.step(a)
    img = render_rgb_2d(ego.unwrapped, tile=14)         # dims unseen cells
    four = gym.make("TopoGym/Grid2D-v0", actions="fourway", obs_mode="vector",
                    **kw)
    vec, _ = four.reset(seed=0)
    code_names = {v: k.removeprefix("OBS_").lower() for k, v in vars(C).items()
                  if k.startswith("OBS_") and isinstance(v, int)
                  and k not in ("OBS_CODE_COUNT", "OBS_MAX")}
    record("demo03", {
        "egocentric": {"action_space": str(ego.action_space),
                       "observation_space": str(ego.observation_space),
                       "patch": obs.tolist(),
                       "codes": {int(k): v for k, v in sorted(code_names.items())}},
        "fourway_vector": {"action_space": str(four.action_space),
                           "observation_space": str(four.observation_space),
                           "obs": vec.tolist()},
    })

    def build(theme):
        t = THEMES[theme]
        fig = plt.figure(figsize=(11.5, 4.2))
        gs = fig.add_gridspec(1, 3, width_ratios=[1.25, 1.0, 1.05], wspace=0.28)
        ax0 = fig.add_subplot(gs[0])
        show_world(ax0, img, "render(): line of sight + heading arrow")
        ax1 = fig.add_subplot(gs[1])
        cmap = plt.get_cmap("tab10", 10)
        ax1.imshow(obs, cmap=cmap, vmin=-0.5, vmax=9.5, interpolation="nearest")
        for (r, c), v in np.ndenumerate(obs):
            ax1.text(c, r, str(int(v)), ha="center", va="center", fontsize=8,
                     color="white" if v in (0, 2, 3, 4) else "black")
        ax1.set_xticks([])
        ax1.set_yticks([])
        ax1.set_title('obs_mode="local": 7×7 codes, facing up')
        used = sorted(set(int(v) for v in obs.ravel()))
        ax1.set_xlabel("  ".join(f"{v}={code_names.get(v, '?')}" for v in used),
                       fontsize=7.5, color=t["muted"])
        ax2 = fig.add_subplot(gs[2])
        labels = ["x", "y"] + [f"t{i}" for i in range(16)]
        ax2.bar(range(18), vec, color=[t["accent"]] * 2 + [t["muted"]] * 16)
        ax2.set_xticks(range(18))
        ax2.set_xticklabels(labels, fontsize=6.5, rotation=90)
        ax2.set_title('obs_mode="vector": (x, y) + 16 texture slots')
        ax2.set_ylabel("value")
        ax2.grid(axis="y", alpha=0.3)
        ax2.text(0.98, 0.55, "texture block is all zero\noutside the Texture slice",
                 transform=ax2.transAxes, ha="right", va="top", fontsize=7.5,
                 color=t["muted"])
        return fig
    save(build, "s02_local_vs_vector")


# ----------------------------------------------------------------------------
# 4. Distance is measured in actions, not cells
# ----------------------------------------------------------------------------

def demo04():
    import networkx as nx

    env_id = "TopoGym/Maze-50-v0"
    core, base_img = world(env_id, tile=7, reveal=True)
    start = core.layout.start
    ego = core.actions_from(start)                       # turn-charging BFS
    fourway = nx.single_source_shortest_path_length(core.graph(), start)
    diff = {c: ego[c] - fourway[c] for c in ego if c in fourway}
    record("demo04", {
        "world": env_id,
        "cells_reached": len(ego),
        "egocentric_max_actions": max(ego.values()),
        "fourway_max_moves": max(fourway.values()),
        "turn_overhead_mean": float(np.mean(list(diff.values()))),
        "turn_overhead_max": max(diff.values()),
        "goal": {"egocentric": ego.get(core.layout.goal),
                 "fourway": fourway.get(core.layout.goal),
                 "optimal_actions()": core.optimal_actions()},
    })
    tile = 7
    base = core.layout.base
    backdrop = grey(base_img)

    def heat(field, cmap, vmin, vmax):
        img = backdrop.copy()
        norm = mcolors.Normalize(vmin=vmin, vmax=vmax)
        cm = plt.get_cmap(cmap)
        for cell, v in field.items():
            rgb = tuple(int(255 * ch) for ch in cm(norm(v))[:3])
            paint(img, base, [cell], rgb, tile, 0.9)
        return img, plt.cm.ScalarMappable(norm=norm, cmap=cm)

    vmax = max(max(ego.values()), max(fourway.values()))
    img_e, sm_e = heat(ego, "viridis", 0, vmax)
    img_f, sm_f = heat(fourway, "viridis", 0, vmax)
    img_d, sm_d = heat(diff, "magma", 0, max(diff.values()))

    def build(theme):
        fig, axes = plt.subplots(1, 3, figsize=(11.5, 4.2))
        for ax, img, sm, title in (
                (axes[0], img_e, sm_e, "env.actions_from(start): actions, turns charged"),
                (axes[1], img_f, sm_f, "fourway: BFS moves on env.graph()"),
                (axes[2], img_d, sm_d, "difference: the turn overhead")):
            show_world(ax, img, title)
            cb = fig.colorbar(sm, ax=ax, fraction=0.046, pad=0.03)
            cb.outline.set_visible(False)
            cb.ax.tick_params(labelsize=7)
        fig.subplots_adjust(wspace=0.12)
        return fig
    save(build, "s01_distance_fields")


# ----------------------------------------------------------------------------
# 5. Watching topology get discovered
# ----------------------------------------------------------------------------

def demo05():
    from topogym.baselines.gridworld2dv1.single_layout import COVERAGE_COLOR

    CYCLE_COLOR = (244, 208, 34)

    # A torus minus two disks: b1 = 2g + k - 1 = 2 + 2 - 1 = 3 (the two
    # torus loops, plus one more for the second puncture).
    kw = dict(base="torus", size=15, n_holes=2, n_chambers=0, n_decoys=0,
              reward_mode="none", max_steps=1500)
    seed = 3
    from topogym.tda import ExplorationTracker

    tracker = ExplorationTracker(gym.make("TopoGym/Grid2D-v0", layout_seed=seed, **kw))
    rec = StatsRecorder(tracker, track_holes=True)
    _, info = rec.reset(seed=0)
    core = rec.unwrapped
    certified = core.homology_stats("certified")
    base = core.layout.base
    rng = np.random.default_rng(0)
    tile = 14
    core.reveal_hidden = True
    full = render_rgb_2d(core, tile=tile)
    core.reveal_hidden = False
    def complement_components():
        """Connected pieces of everything not in the observed region."""
        rest = set(base.cells()) - set(core._observed_free)
        seen, comps = set(), []
        for c in sorted(rest):
            if c in seen:
                continue
            stack, comp = [c], []
            seen.add(c)
            while stack:
                u = stack.pop()
                comp.append(u)
                for v in base.neighbors(u):
                    if v in rest and v not in seen:
                        seen.add(v)
                        stack.append(v)
            comps.append(comp)
        return comps

    n_side = kw["size"]

    def torus_delta(a, b):
        return tuple(min(abs(a[i] - b[i]), n_side - abs(a[i] - b[i])) for i in (0, 1))

    def ring_around(obsr, comp):
        """Seen cells surrounding an enclosed component (Chebyshev-adjacent)."""
        return [o for o in obsr
                if any(max(torus_delta(o, c)) == 1 for c in comp)]

    def tight_wrap_cycle(obsr, axis):
        """A shortest observed cycle winding once around the torus in `axis`:
        BFS with the seam cut, plus the one seam step that closes it."""
        i = 0 if axis == "x" else 1
        crosses = lambda u, v: abs(u[i] - v[i]) > 1  # noqa: E731
        best = None
        for c in obsr:
            if c[i] != n_side - 1:
                continue
            d = (0, c[1]) if axis == "x" else (c[0], 0)
            if d not in obsr:
                continue
            parents, queue = {d: None}, [d]
            while queue:
                u = queue.pop(0)
                if u == c:
                    break
                for v in base.neighbors(u):
                    if v in obsr and v not in parents and not crosses(u, v):
                        parents[v] = u
                        queue.append(v)
            if c not in parents:
                continue
            path = [c]
            while parents[path[-1]] is not None:
                path.append(parents[path[-1]])
            if best is None or len(path) < len(best):
                best = path
        return best

    curve, snaps, seen_k, prev_enclosed, had_wrap = [], [], 0, 0, set()
    for step in range(1, kw["max_steps"] + 1):
        _, _, term, trunc, info = rec.step(int(rng.integers(3)))
        h = core.homology_stats("observed")
        curve.append(h.h1)
        if len(rec.hole_steps[1]) > seen_k:          # a new loop was first seen
            seen_k = len(rec.hole_steps[1])
            # the known region: everything the agent has not yet seen is dark
            img = full.copy()
            unknown = [c for c in base.cells() if c not in core._observed_free
                       and c not in core._visited]
            paint(img, base, unknown, (58, 66, 102), tile, 0.55)  # unseen: translucent blue-grey veil
            paint(img, base, core._visited, COVERAGE_COLOR, tile, 0.4)
            # enclosed-but-unseen cells (filling a piece back in would kill
            # an H1 class) in red; walls stay walls
            obsr = set(core._observed_free)
            enclosed = [comp for comp in complement_components()
                        if core._betti_of(obsr | set(comp))[1] < h.h1]
            free_cells = set(core.layout.free_cells)
            for comp in enclosed:
                paint(img, base, [c for c in comp if c in free_cells],
                      (235, 60, 40), tile, 0.8)
            # highlight only the newborn class, tightly: a shortest wrap
            # cycle when the seen band closed around the torus, rings
            # around the enclosed regions otherwise
            if len(enclosed) > prev_enclosed:
                note = "a new region is enclosed"
                for comp in enclosed:
                    paint(img, base, ring_around(obsr, comp), CYCLE_COLOR, tile, 0.8)
            else:
                note = "the new loop wraps the torus"
                for axis in ("x", "y"):
                    if axis not in had_wrap:
                        cyc = tight_wrap_cycle(obsr, axis)
                        if cyc is not None:
                            had_wrap.add(axis)
                            paint(img, base, cyc, CYCLE_COLOR, tile, 0.8)
                            break
            prev_enclosed = len(enclosed)
            x, y = base.layout_coords(core._state.cell)
            img[y * tile:(y + 1) * tile, x * tile:(x + 1) * tile] = \
                full[y * tile:(y + 1) * tile, x * tile:(x + 1) * tile]
            snaps.append((step, seen_k, img, info["coverage"], info["observed_frac"], note))
        if term or trunc:
            break
    diagram = tracker.discovery_diagram()
    tsummary = tracker.summary()
    record("demo05", {
        "layout_seed": seed,
        "tracker_summary": tsummary,
        "discovery_diagram_h1": [(float(b), None if d == float("inf") else float(d))
                                 for b, d in diagram.get(1, [])],
        "certified": str(certified),
        "observed_at_end": str(core.homology_stats("observed")),
        "visited_at_end": str(core.homology_stats("visited")),
        "steps_to_h1_holes": rec.hole_steps[1],
        "steps_to_h0_holes": rec.hole_steps[0],
        "final_coverage": info["coverage"],
        "final_observed_frac": info["observed_frac"],
        "snapshot_notes": [(s, k, note) for s, k, _, _, _, note in snaps],
        "peak_observed_h1": int(max(curve)),
        "steps": len(curve),
    })

    def build(theme):
        t = THEMES[theme]
        n = len(snaps)
        fig = plt.figure(figsize=(11, 6.0))
        gs = fig.add_gridspec(2, max(n, 1), height_ratios=[0.9, 1.2], hspace=0.38,
                              wspace=0.08)
        top = gs[0, :].subgridspec(1, 2, width_ratios=[3.0, 1.0], wspace=0.18)
        ax = fig.add_subplot(top[0])
        bars = diagram.get(1, [])
        axb = fig.add_subplot(top[1])
        end = len(curve)
        for j, (b, d) in enumerate(sorted(bars)):
            essential = d == float("inf")
            axb.hlines(j, b, end if essential else d, lw=3,
                       color=t["accent2"] if essential else t["muted"])
            if not essential:
                axb.plot([d], [j], marker="|", color=t["muted"], ms=8)
        axb.set_yticks(range(len(bars)))
        axb.set_yticklabels([f"bar {j + 1}" for j in range(len(bars))], fontsize=7)
        axb.set_xlim(0, end)
        axb.set_xlabel("step")
        axb.set_title("ExplorationTracker.discovery_diagram()[1]", fontsize=8)
        axb.text(0.97, 0.06, "essential: real loop\nfinite: transient belief",
                 transform=axb.transAxes, ha="right", va="bottom", fontsize=7,
                 color=t["muted"])
        axb.grid(axis="x", alpha=0.3)
        xs = np.arange(1, len(curve) + 1)
        ax.step(xs, curve, where="post", color=t["accent"], lw=1.5,
                label='env.homology_stats("observed").h1')
        ax.axhline(certified.h1, color=t["accent2"], ls="--", lw=1.2,
                   label=f'certified h1 = {certified.h1}')
        for s, k, *_ in snaps:
            ax.axvline(s, color=t["muted"], lw=0.6, ls=":")
        ax.set_ylim(-0.2, max(max(curve), certified.h1) + 0.8)
        ax.set_yticks(range(0, max(max(curve), certified.h1) + 1))
        ax.set_xlabel("step (random egocentric walk)")
        ax.set_ylabel("H1 of the known region")
        ax.legend(loc="lower right", ncol=2)
        ax.grid(axis="y", alpha=0.3)
        for i, (s, k, img, cov, obs, note) in enumerate(snaps):
            a = fig.add_subplot(gs[1, i])
            show_world(a, img, f"step {s}: h1 ≥ {k}\n{note}")
            a.set_xlabel(f"seen {obs:.0%} · visited {cov:.0%}", fontsize=8)
        return fig
    save(build, "s05_discovery")


# ----------------------------------------------------------------------------
# 6. Curvature reads structure
# ----------------------------------------------------------------------------

def demo06():
    env_id = "TopoGym/Bottleneck3-100-v0"
    tile = 4
    core, base_img = world(env_id, tile=tile, reveal=True)
    t0 = time.time()
    ricci = core.ollivier_ricci()
    ricci_seconds = time.time() - t0
    vals = np.array(list(ricci.values()))
    necks = core.bottlenecks()
    # Has a random explorer found the hard geometry?
    rec = StatsRecorder(gym.make(env_id), track_curvature=True)
    rng = np.random.default_rng(0)
    for _ in range(5):
        rec.reset(seed=0)
        done = False
        while not done:
            _, _, term, trunc, _ = rec.step(int(rng.integers(3)))
            done = term or trunc
    m = rec.metrics()
    record("demo06", {
        "world": env_id,
        "free_cells": len(ricci),
        "seconds_to_compute": round(ricci_seconds, 2),
        "kappa_min": float(vals.min()), "kappa_max": float(vals.max()),
        "fraction_negative": float((vals < 0).mean()),
        "fraction_below_-0.1": float((vals < -0.1).mean()),
        "bottlenecks()": len(necks),
        "random_5_episodes": {
            "state_coverage": m.state_coverage,
            "curvature_coverage_below_zero": m.curvature_coverage_below_zero,
            "curvature_coverage(-0.1)": rec.curvature_coverage(-0.1),
        },
    })
    lim = max(abs(vals.min()), abs(vals.max()), 0.05)
    norm = mcolors.TwoSlopeNorm(vmin=-lim, vcenter=0.0, vmax=lim)
    cm = plt.get_cmap("RdBu")
    img = grey(base_img, 0.35)
    for cell, k in ricci.items():
        if abs(k) < 1e-9:
            continue                                  # flat: leave the floor
        rgb = tuple(int(255 * ch) for ch in cm(norm(k))[:3])
        paint(img, core.layout.base, [cell], rgb, tile, 1.0)
    sm = plt.cm.ScalarMappable(norm=norm, cmap=cm)

    def build(theme):
        t = THEMES[theme]
        fig = plt.figure(figsize=(11, 4.6))
        gs = fig.add_gridspec(1, 2, width_ratios=[1.15, 1.0], wspace=0.25)
        ax = fig.add_subplot(gs[0])  # noqa: F841
        show_world(ax, img, "env.ollivier_ricci() on Bottleneck3-100")
        # zoom on the most negative doorway (flat cells are left uncoloured)
        from mpl_toolkits.axes_grid1.inset_locator import inset_axes
        worst = min(ricci, key=ricci.get)
        wx, wy = core.layout.base.layout_coords(worst)
        r = 7
        crop = img[max(0, (wy - r) * tile):(wy + r + 1) * tile,
                   max(0, (wx - r) * tile):(wx + r + 1) * tile]
        ins = inset_axes(ax, width="34%", height="34%", loc="lower right",
                         borderpad=0.6)
        ins.imshow(crop, interpolation="nearest")
        ins.set_xticks([]); ins.set_yticks([])
        for sp in ins.spines.values():
            sp.set_edgecolor(t["muted"]); sp.set_linewidth(0.8)
        ins.set_title(f"zoom: κ = {ricci[worst]:.2f}", fontsize=7, pad=2)
        cb = fig.colorbar(sm, ax=ax, fraction=0.046, pad=0.03)
        cb.outline.set_visible(False)
        cb.ax.tick_params(labelsize=7)
        cb.ax.set_title("κ", fontsize=8)
        ax2 = fig.add_subplot(gs[1])
        ax2.hist(vals, bins=40, color=t["accent"], alpha=0.85)
        ax2.axvline(0, color=t["muted"], lw=0.8)
        ax2.set_yscale("log")
        ax2.set_xlabel("κ")
        ax2.set_ylabel("free cells (log)")
        ax2.set_title("most of the world is flat; doorways are not")
        ax2.grid(axis="y", alpha=0.3)
        ax2.text(0.03, 0.95,
                 f"κ < 0 on {100 * (vals < 0).mean():.1f}% of cells\n"
                 f"random walk, 5 episodes:\n"
                 f"  state coverage {m.state_coverage:.1%}\n"
                 f"  curvature_coverage_below_zero {m.curvature_coverage_below_zero:.1%}",
                 transform=ax2.transAxes, va="top", fontsize=7.5,
                 family="monospace", color=t["text"])
        return fig
    save(build, "s06_curvature")


# ----------------------------------------------------------------------------
# 7. The teleport contract
# ----------------------------------------------------------------------------

def demo07():
    import imageio.v3 as iio
    from topogym.baselines.gridworld2dv1.archive import DEFAULTS
    from topogym.baselines.gridworld2dv1.concrete_baselines.goexplore_phase1 import (
        GoExploreReset,
    )
    from topogym.baselines.gridworld2dv1.single_layout import (
        COVERAGE_COLOR, COVERAGE_STRENGTH,
    )

    horizon, n_episodes, every = 150, 300, 5
    env = gym.make("TopoGym/Maze-50-v0", seed=1, teleport=True, max_steps=horizon)
    core = env.unwrapped
    _, info = env.reset(seed=0)
    try:
        env.reset(options={"teleport": (40, 40)})
        guard = "no error (unexpected)"
    except ValueError as exc:
        guard = str(exc)
    record("demo07_guard", guard)

    # Go-Explore phase 1 with the library's own archive probe: at every
    # episode boundary it folds the finished episode into the archive and
    # selects the next cell by the paper's count-based score.
    probe = GoExploreReset(DEFAULTS, seed=0)
    rng = np.random.default_rng(0)
    tile = 6
    base = core.layout.base
    _, info = env.reset(seed=0)
    core.reveal_hidden = True
    canvas = render_rgb_2d(core, tile=tile)
    core.reveal_hidden = False
    frames, jumps, cov_curve = [], [], []
    for ep in range(n_episodes):
        done = False
        while not done:
            _, _, term, trunc, info = env.step(int(rng.integers(3)))
            done = term or trunc
        last = info["position"]
        target = probe(core, info)                     # archive select
        jumps.append(int(abs(target[0] - last[0]) + abs(target[1] - last[1])))
        cov_curve.append(info["lifetime_coverage"])
        if ep % every == 0 or ep == n_episodes - 1:
            frame = canvas.copy()
            paint(frame, base, core._ever_visited | core._visited, COVERAGE_COLOR,
                  tile, COVERAGE_STRENGTH)
            paint(frame, base, core._visited, (40, 120, 255), tile, 0.35)
            paint(frame, base, [target], (255, 230, 40), tile, 1.0)
            frames.append(frame)
        _, info = env.reset(options={"teleport": target})
    frames += [frames[-1]] * 8
    path = FIG / "s04_goexplore_frontier.gif"
    iio.imwrite(path, frames, extension=".gif", duration=120, loop=0)
    record("demo07_archive", {
        "episodes": n_episodes,
        "horizon": horizon,
        "archive_cells": len(core._ever_visited | core._visited),
        "lifetime_coverage": info["lifetime_coverage"],
        "teleport_start": info["teleport_start"],
        "median_jump_manhattan": float(np.median(jumps)),
        "max_jump_manhattan": max(jumps),
        "archive_summary": probe.archive.summary(),
        "coverage_every_50_episodes": [round(cov_curve[i], 3)
                                       for i in range(49, n_episodes, 50)],
    })
    print(f"  wrote {path.name}")


# ----------------------------------------------------------------------------
# 8. Instrumentation for free
# ----------------------------------------------------------------------------

def demo08():
    import pandas as pd

    env_id = "TopoGym/Decoys4-50-v0"
    rec = StatsRecorder(gym.make(env_id, seed=1, actions="fourway", max_steps=1500),
                        record_steps=True)
    rng = np.random.default_rng(0)
    for _ in range(30):
        rec.reset(seed=0)
        done = False
        while not done:
            _, _, term, trunc, _ = rec.step(int(rng.integers(4)))
            done = term or trunc
    m = rec.metrics()
    episodes = pd.DataFrame(rec.episodes)
    steps = pd.DataFrame(rec.steps)
    # dict-valued columns become JSON strings so the table round-trips.
    flat = episodes.copy()
    for col in ("chamber_entry_steps", "coverage_milestones"):
        flat[col] = flat[col].map(json.dumps)
    flat.to_parquet(FIG / "s07_episodes.parquet", index=False)
    steps.to_parquet(FIG / "s07_steps.parquet", index=False)
    cols = ["episode", "length", "coverage", "lifetime_coverage", "chambers_entered",
            "chamber_entry_steps", "h0_merges", "goal_reached", "steps_to_success",
            "optimal_steps", "regret"]
    record("demo08", {
        "world": env_id,
        "metrics": m.to_dict(),
        "episodes_columns": list(episodes.columns),
        "steps_columns": list(steps.columns),
        "goal_rows": episodes.loc[episodes["goal_reached"], cols].to_dict(orient="records"),
        "first_rows": episodes[cols].head(4).to_dict(orient="records"),
        "parquet_bytes": {"episodes": (FIG / "s07_episodes.parquet").stat().st_size,
                          "steps": (FIG / "s07_steps.parquet").stat().st_size},
    })

    def build(theme):
        t = THEMES[theme]
        fig, axes = plt.subplots(2, 2, figsize=(10, 5.8))
        fig.subplots_adjust(hspace=0.55, wspace=0.3)
        a = axes[0, 0]
        a.plot(steps["global_step"], steps["lifetime_coverage"], color=t["accent"], lw=1.3)
        a.plot(steps["global_step"], steps["coverage"], color=t["accent3"], lw=0.6, alpha=0.8)
        for frac, gstep in sorted(m.steps_to_coverage.items()):
            a.axvline(gstep, color=t["muted"], lw=0.5, ls=":")
            a.text(gstep, 0.02, f"{frac:.0%}", fontsize=6.5, rotation=90,
                   color=t["muted"], va="bottom", ha="right")
        a.set_title("coverage: lifetime (thick), per episode (thin), milestones")
        a.set_xlabel("global step")
        a.set_ylabel("fraction of free cells")
        a = axes[0, 1]
        a.bar(episodes["episode"], episodes["chambers_entered"], color=t["accent"])
        for _, row in episodes.iterrows():
            for idx, step in row["chamber_entry_steps"].items():
                a.text(row["episode"], row["chambers_entered"] + 0.05, f"t={step}",
                       ha="center", fontsize=6, color=t["muted"])
        a.set_title("chambers_entered per episode (+ entry step)")
        a.set_xlabel("episode")
        a.set_ylabel("chambers")
        a.set_yticks(range(0, int(episodes["chambers_entered"].max()) + 2))
        a = axes[1, 0]
        a.bar(episodes["episode"], episodes["h0_merges"], color=t["accent2"])
        a.set_title("h0_merges per episode (known pieces joining up)")
        a.set_xlabel("episode")
        a.set_ylabel("merges")
        a = axes[1, 1]
        hit = episodes[episodes["goal_reached"]]
        a.bar(hit["episode"], hit["steps_to_success"], color=t["accent"], width=0.8,
              label="steps_to_success")
        a.axhline(episodes["optimal_steps"].iloc[0], color=t["accent2"], ls="--",
                  lw=1.0, label=f"optimal_steps = {episodes['optimal_steps'].iloc[0]}")
        for _, row in hit.iterrows():
            a.text(row["episode"], row["steps_to_success"] + 10, f"regret {int(row['regret'])}",
                   ha="center", fontsize=6.5, color=t["muted"])
        a.set_xlim(-1, len(episodes))
        a.set_title("episodes that reached the goal: steps and regret")
        a.set_xlabel("episode")
        a.set_ylabel("steps")
        a.legend(loc="center right", fontsize=7)
        for a in axes.ravel():
            a.grid(axis="y", alpha=0.3)
        return fig
    save(build, "s07_dashboard")


# ----------------------------------------------------------------------------
# 9. The benchmark in three lines
# ----------------------------------------------------------------------------

def demo09():
    from topogym.baselines.gridworld2dv1.instances import (
        SPLIT_DIR, load_split, make_instance,
    )
    from topogym.baselines.gridworld2dv1.single_layout import single_episode_ceiling

    splits = pathlib.Path(os.environ.get("TOPOGYM_SPLITS", SPLIT_DIR))
    rows = load_split("test", path=splits)
    roster = benchmarks.benchmark()
    cache = FIG / "demo09_cache.json"
    episodes = int(os.environ.get("DEMO9_EPISODES", "50"))
    if cache.exists():
        per_row = json.loads(cache.read_text())
    else:
        per_row = []
        rng = np.random.default_rng(0)
        for i, row in enumerate(rows):
            ceiling = single_episode_ceiling(row["template_id"], int(row["seed"]), row=row)
            env = StatsRecorder(make_instance(row, flatten=False))
            for _ in range(episodes):
                env.reset(seed=0)
                done = False
                while not done:
                    _, _, term, trunc, info = env.step(int(rng.integers(env.action_space.n)))
                    done = term or trunc
            m = env.metrics()
            env.close()
            per_row.append({"unit": row["unit"], "family": row["family"],
                            "slice": row["slice"], "seed": int(row["seed"]),
                            "ceiling": ceiling, "random_coverage": m.state_coverage,
                            "random_success": m.success_rate})
            if i % 20 == 0:
                print(f"  demo09 {i + 1}/{len(rows)} [{time.time() - T0:5.1f}s]")
        cache.write_text(json.dumps(per_row, indent=1))
    fams: dict = {}
    for r in per_row:
        fams.setdefault((r["slice"], r["family"]), []).append(r)
    table = sorted(
        ((s, f, float(np.mean([r["ceiling"] for r in rs])),
          float(np.mean([r["random_coverage"] for r in rs])),
          float(np.mean([r["random_success"] for r in rs])), len(rs))
         for (s, f), rs in fams.items()),
        key=lambda x: (x[0], -x[3]))
    record("demo09", {
        "split_dir": str(splits),
        "test_rows": len(rows),
        "first_row": rows[0],
        "roster": {"title": roster.get("title"), "frozen": roster.get("frozen"),
                   "n_families": len(roster.get("families", {})),
                   "extrapolation_train_max": roster.get("extrapolation_train_max")},
        "families_in_v1": sorted(benchmarks.families().keys()),
        "random_episodes_per_world": episodes,
        "pooled_random_coverage": float(np.mean([r["random_coverage"] for r in per_row])),
        "pooled_random_success": float(np.mean([r["random_success"] for r in per_row])),
        "per_family": [{"slice": s, "family": f, "ceiling": c, "random": rc,
                        "success": su, "n": n} for s, f, c, rc, su, n in table],
    })

    def build(theme):
        t = THEMES[theme]
        fig, ax = plt.subplots(figsize=(9.5, 7.2))
        ys = np.arange(len(table))
        ax.barh(ys, [x[2] for x in table], color=t["grid"], height=0.72,
                label="single_episode_ceiling (mean over test worlds)")
        ax.barh(ys, [x[3] for x in table], color=t["accent"], height=0.45,
                label=f"uniform-random policy, {episodes} episodes (lifetime coverage)")
        ax.set_yticks(ys)
        ax.set_yticklabels([f"{f}  ({s})" for s, f, *_ in table], fontsize=7.5)
        ax.invert_yaxis()
        ax.set_xlim(0, 1.02)
        ax.set_xlabel("fraction of free cells")
        ax.set_title("TopoGym-v1 test split: per-family ceiling and random floor")
        ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.07), ncol=2)
        ax.grid(axis="x", alpha=0.3)
        for y, (s, f, c, rc, su, n) in zip(ys, table):
            ax.text(min(c, 0.98) + 0.01, y, f"{rc:.0%}", va="center", fontsize=6.5,
                    color=t["muted"])
        return fig
    save(build, "s09_benchmark")


# ----------------------------------------------------------------------------
# s10. The EpicChase k sweep: a complete study per world, 1M steps each
#
# Needs the repository checkout on PYTHONPATH (the EpicChase sweep ids and
# topogym.baselines.gridworld2dv1.comparison land after the 0.3.0 wheel).
# ----------------------------------------------------------------------------

S10_UNITS = ["EpicChase1-60", "EpicChase2-70", "EpicChase3-70", "EpicChase4-90",
             "EpicChase6-110", "EpicChase8-120", "EpicChase12-150"]
S10_BUDGET = 1_000_000


def s10_sweep_study():
    import logging

    import pandas as pd

    from topogym.baselines.gridworld2dv1.comparison import (
        first_goal_steps, plot_solve_profile)
    from topogym.baselines.gridworld2dv1.concrete_baselines.goexplore_phase1 import (
        GoExplorePhase1Baseline)
    from topogym.baselines.gridworld2dv1.concrete_baselines.random_walk import RandomBaseline
    from topogym.baselines.gridworld2dv1.instances import make_instance
    from topogym.baselines.gridworld2dv1.protocol import BaselineConfig
    from topogym.baselines.gridworld2dv1.single_layout import (
        coverage_gifs, layout_row, plot_single_layout, single_episode_ceiling,
        write_single_layout_md)

    if "TopoGym/EpicChase12-150-v0" not in gym.registry:
        raise RuntimeError(
            "section 10 needs the TopoGym repository checkout on PYTHONPATH: "
            "the EpicChase k-sweep ids are newer than the 0.3.0 wheel"
        )
    logging.getLogger("topogym").setLevel(logging.WARNING)
    root = FIG / "s10_study"
    ids = {u: f"TopoGym/{u.rsplit('-', 1)[0]}-{u.rsplit('-', 1)[1]}-v0"
           for u in S10_UNITS}
    timings = {}
    for unit, env_id in ids.items():
        row = layout_row(env_id, seed=0)
        for cls in (RandomBaseline, GoExplorePhase1Baseline):
            target = root / unit / "results" / f"{cls.name}.json"
            if target.exists():
                continue
            t0 = time.time()
            baseline = cls(BaselineConfig(seed=0))
            result = baseline.single_layout_train_test_run(
                row, step_budget=S10_BUDGET, eval_episodes=20,
                telemetry_root=str(root / unit / "telemetry"), step_stride=100)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(result.to_dict(), indent=2, default=str))
            timings[f"{unit}/{cls.name}"] = round(time.time() - t0, 1)
            print(f"  {unit} {cls.name} {timings[f'{unit}/{cls.name}']}s")
        plot_single_layout(root, unit)
        coverage_gifs(root, unit)
        write_single_layout_md(root, unit)
        alias = root / f"{unit}@0"          # first_goal_steps reads seed-tagged dirs
        if not alias.exists():
            alias.symlink_to(unit)

    plot_solve_profile(root, ["go-explore-phase1"], budget=S10_BUDGET,
                       labels={"go-explore-phase1": "Go-Explore phase 1"})
    shutil.copy(root / "plots" / "solve_profile.png", FIG / "s10_solve_profile.png")
    shutil.copy(root / "EpicChase12-150" / "gifs" / "go-explore-phase1-coverage.gif",
                FIG / "s10_epicchase12_coverage.gif")

    steps_to_goal = first_goal_steps(root, ["random", "go-explore-phase1"],
                                     budget=S10_BUDGET)
    table, panels = [], []
    for unit, env_id in ids.items():
        res = json.loads((root / unit / "results" / "go-explore-phase1.json").read_text())
        eps = pd.read_parquet(root / unit / "telemetry" / "episodes")
        train = eps[(eps["split"] == "single-train")
                    & (eps["algorithm"] == "go-explore-phase1")]
        table.append({
            "unit": unit, "k": int(unit.split("-")[0].removeprefix("EpicChase")),
            "ceiling": round(single_episode_ceiling(env_id, 0, row=res["row"]), 3),
            "ge_train_coverage": round(float(train["lifetime_coverage"].max()), 3),
            "ge_goals": int(train["reached_goal"].sum()),
            "ge_first_goal_step": steps_to_goal["go-explore-phase1"].get(f"{unit}@0"),
            "random_first_goal_step": steps_to_goal["random"].get(f"{unit}@0"),
        })
        # where the archive got to, for the coverage strip
        steps_tbl = pd.read_parquet(root / unit / "telemetry" / "steps")
        steps_tbl = steps_tbl[(steps_tbl["split"] == "single-train")
                              & (steps_tbl["algorithm"] == "go-explore-phase1")]
        env = make_instance(res["row"], reveal_hidden=True, flatten=False)
        core = env.unwrapped
        core.reset(seed=0)
        tile = max(2, 360 // core.layout.base.layout_size()[0])
        img = render_rgb_2d(core, tile=tile)
        cells = set(zip(steps_tbl["x"].astype(int), steps_tbl["y"].astype(int)))
        paint(img, core.layout.base, cells, (60, 220, 90), tile, 0.55)
        env.close()
        panels.append((f"k={table[-1]['k']}\ncov {table[-1]['ge_train_coverage']:.0%}", img))
    record("s10_sweep", {"budget": S10_BUDGET, "timings_seconds": timings,
                         "table": table})

    def build_sweep(theme):
        t = THEMES[theme]
        fig, (a0, a1) = plt.subplots(1, 2, figsize=(10, 3.8))
        ks = [r["k"] for r in table]
        a0.plot(ks, [r["ge_train_coverage"] for r in table], "o-", color=t["accent"],
                label="go-explore-phase1, 1M steps")
        a0.plot(ks, [r["ceiling"] for r in table], "s--", color=t["accent2"],
                label="single-episode ceiling")
        a0.set_xlabel("chambers k")
        a0.set_ylabel("fraction of the world covered")
        a0.set_xticks(ks)
        a0.set_ylim(0, 1.02)
        a0.legend()
        a0.grid(axis="y", alpha=0.3)
        a0.set_title("coverage against the ceiling, per k")
        for r in table:
            v = r["ge_first_goal_step"]
            if v is None:
                a1.plot([r["k"]], [1e6], marker="x", ms=9, color=t["muted"])
            else:
                a1.plot([r["k"]], [v], marker="o", ms=6, color=t["accent"])
        a1.set_yscale("log")
        a1.set_xlabel("chambers k")
        a1.set_ylabel("steps to first goal (log)")
        a1.set_xticks(ks)
        a1.axhline(1e6, color=t["muted"], lw=0.8, ls=":")
        a1.text(0.02, 0.9, "x = never within the 1M budget", transform=a1.transAxes,
                fontsize=8, color=t["muted"], va="top")
        a1.set_title("time to first solve, per k")
        a1.grid(axis="y", alpha=0.3)
        return fig
    save(build_sweep, "s10_sweep")

    def build_row(theme):
        fig, axes = plt.subplots(1, len(panels), figsize=(11.5, 2.6))
        for ax, (cap, img) in zip(axes, panels):
            show_world(ax, img)
            ax.set_xlabel(cap, fontsize=8)
        fig.subplots_adjust(wspace=0.06)
        return fig
    save(build_row, "s10_sweep_coverage")


# ----------------------------------------------------------------------------
# outro: keyboard play and croissant.json
# ----------------------------------------------------------------------------

def outro():
    repo = os.environ.get("TOPOGYM_REPO")
    info = {"play": 'pip install "topogym[play]" && python scripts/play.py TopoGym/SpaceWarp-v0'}
    if repo and (pathlib.Path(repo) / "croissant.json").exists():
        cj = json.loads((pathlib.Path(repo) / "croissant.json").read_text())
        info["croissant"] = {
            "name": cj.get("name"), "version": cj.get("version"),
            "conformsTo": cj.get("conformsTo"),
            "recordSets": [r.get("name") or r.get("@id") for r in cj.get("recordSet", [])],
        }
    record("outro", info)



# ----------------------------------------------------------------------------
# s01b. Building worlds: the generator's knobs, rendered
# ----------------------------------------------------------------------------

def s01_build():
    builds = [
        ('style="maze", braid=0.15',
         dict(id="TopoGym/Grid2D-v0", base="square", size=31, style="maze",
              braid=0.15, layout_seed=2)),
        ('chamber_shape="star",\ndecoy_shape="triangle"',
         dict(id="TopoGym/Grid2D-v0", base="square", size=41, n_chambers=1,
              n_decoys=3, chamber_shape="star", decoy_shape="triangle",
              chamber_side=11, decoy_side=11, layout_seed=3)),
        ("n_partitions=2",
         dict(id="TopoGym/Grid2D-v0", base="square", size=41, n_partitions=2,
              n_chambers=1, layout_seed=4)),
        ('door_kind="open",\ndoors_per_chamber=2',
         dict(id="TopoGym/Grid2D-v0", base="square", size=31, n_chambers=2,
              door_kind="open", doors_per_chamber=2, layout_seed=5)),
        ("placement_jitter=4, seed 1",
         dict(id="TopoGym/Grid2D-v0", base="square", size=31, n_chambers=1,
              n_decoys=2, n_holes=2, placement_jitter=4, layout_seed=1)),
        ("placement_jitter=4, seed 2",
         dict(id="TopoGym/Grid2D-v0", base="square", size=31, n_chambers=1,
              n_decoys=2, n_holes=2, placement_jitter=4, layout_seed=2)),
        ("Ladders-v0 (a Texture scenario)", dict(id="TopoGym/Ladders-v0")),
        ('base="rp2"',
         dict(id="TopoGym/Grid2D-v0", base="rp2", size=21, n_holes=1,
              layout_seed=6)),
    ]
    panels, out = [], {}
    for label, kw in builds:
        kw = dict(kw)
        env_id = kw.pop("id")
        core, img = world(env_id, tile=max(4, 360 // (kw.get("size", 50))),
                          reveal=True, **kw)
        m = core.topology
        out[label.replace("\n", " ")] = {"betti_z2": list(m.betti_z2),
                                         "betti_z2_sealed": list(m.betti_z2_sealed)}
        panels.append((label, img))
    record("s01_build", out)

    def build(theme):
        fig, axes = plt.subplots(2, 4, figsize=(11.5, 6.4))
        for ax, (label, img) in zip(axes.ravel(), panels):
            show_world(ax, img)
            ax.set_xlabel(label, fontsize=8, labelpad=5)
        fig.subplots_adjust(wspace=0.08, hspace=0.24)
        return fig
    save(build, "s01_build_gallery")


# ----------------------------------------------------------------------------
# s02. The dict observation on a plain, two animated, and a Top environment
# ----------------------------------------------------------------------------

def s02_dict_obs():
    from topogym.core import constants as C
    from topogym.core.constants import TextureSlotMap

    names = TextureSlotMap().names()
    code_names = {v: k.removeprefix("OBS_").lower() for k, v in vars(C).items()
                  if k.startswith("OBS_") and isinstance(v, int)
                  and k not in ("OBS_CODE_COUNT", "OBS_MAX")}
    worlds = [("Decoys4-50 (GridWorld2D)", "TopoGym/Decoys4-50-v0", 800),
              ("EnvironmentalIceShip (Texture)", "TopoGym/EnvironmentalIceShip-v0", 800),
              ("ClownChase (Texture)", "TopoGym/ClownChase-v0", 800),
              ("TopKlein-50 (Top)", "TopoGym/TopKlein-50-v0", 800)]
    rows, out = [], {}
    tile = 12
    for label, env_id, nsteps in worlds:
        # A random fourway walk; keep the observation from the step where
        # the patch and texture block carry the most distinct information.
        env = gym.make(env_id, obs_mode="dict", actions="fourway", max_steps=nsteps,
                       reward_mode="none")
        obs, info = env.reset(seed=0)
        core = env.unwrapped
        rng = np.random.default_rng(1)
        best, best_score, img, step_at = obs, -1, None, 0
        for step in range(nsteps):
            obs, _, term, trunc, info = env.step(int(rng.integers(4)))
            codes = set(int(v) for v in obs["patch"].ravel()) - {5, 6}
            slots = int((obs["textures"].sum(axis=(0, 1)) > 0).sum())
            score = 3 * len(codes) + 2 * slots + int((obs["textures"].sum(axis=2) > 0).mean() * 4)
            if score > best_score:
                best, best_score, step_at = obs, score, step + 1
                img = render_rgb_2d(core, tile=tile)   # line-of-sight dimming on
            if term or trunc:
                break
        obs = best
        ax_ = int(obs["position"][0]); ay_ = int(obs["position"][1])
        ax_, ay_ = core.layout.base.layout_coords((ax_, ay_))
        r = 9
        H, W = img.shape[0] // tile, img.shape[1] // tile
        x0, x1 = max(0, ax_ - r), min(W, ax_ + r + 1)
        y0, y1 = max(0, ay_ - r), min(H, ay_ + r + 1)
        crop = img[y0 * tile:y1 * tile, x0 * tile:x1 * tile]
        tex = obs["textures"]
        active = [names[j] for j in np.argwhere(tex.sum(axis=(0, 1)) > 0).ravel()]
        rows.append((label, crop, obs["patch"], tex.sum(axis=2), active))
        out[env_id] = {"spaces": {k: str(v) for k, v in env.observation_space.spaces.items()},
                       "position": obs["position"].tolist(), "step": step_at,
                       "patch_codes": sorted(set(int(v) for v in obs["patch"].ravel())),
                       "active_texture_slots": active,
                       "action_space": str(env.action_space)}
    record("s02_dict_obs", {"slot_names": list(names), "codes": code_names, "envs": out})

    def build(theme):
        t = THEMES[theme]
        n = len(rows)
        fig, axes = plt.subplots(n, 3, figsize=(10.5, 3.1 * n),
                                 gridspec_kw={"width_ratios": [1.15, 1, 1], "wspace": 0.18,
                                              "hspace": 0.42})
        cmap = plt.get_cmap("tab10", 10)
        for i, (label, crop, patch, count, active) in enumerate(rows):
            a = axes[i, 0]
            show_world(a, crop, f"{label}: render around the agent")
            a = axes[i, 1]
            a.imshow(patch, cmap=cmap, vmin=-0.5, vmax=9.5, interpolation="nearest")
            for (rr, cc), v in np.ndenumerate(patch):
                a.text(cc, rr, str(int(v)), ha="center", va="center", fontsize=7,
                       color="white" if v in (0, 2, 3, 4) else "black")
            a.set_xticks([]); a.set_yticks([])
            a.set_title('obs["patch"]: 7×7 codes', fontsize=9)
            used = sorted(set(int(v) for v in patch.ravel()))
            a.set_xlabel("  ".join(f"{v}={code_names.get(v, '?')}" for v in used),
                         fontsize=7, color=t["muted"])
            a = axes[i, 2]
            a.imshow(count, cmap="Blues", vmin=0, vmax=max(4, int(count.max())),
                     interpolation="nearest")
            for (rr, cc), v in np.ndenumerate(count):
                if v:
                    a.text(cc, rr, str(int(v)), ha="center", va="center", fontsize=7,
                           color="white" if v >= 3 else "black")
            a.set_xticks([]); a.set_yticks([])
            a.set_title('obs["textures"]: active slots per cell', fontsize=9)
            a.set_xlabel("slots on: " + (", ".join(active) if active else "none (all zero)"),
                         fontsize=7, color=t["muted"], wrap=True)
        return fig
    save(build, "s02_dict_observations")


# ----------------------------------------------------------------------------
# s03. Goals, chambers, decoys, deception
# ----------------------------------------------------------------------------

def s03_features():
    kw = dict(base="square", size=25, n_holes=2, n_chambers=1, n_decoys=2,
              layout_seed=5)
    env = gym.make("TopoGym/Grid2D-v0", reward_mode="deceptive", reveal_hidden=True, **kw)
    obs, info = env.reset(seed=0)
    core = env.unwrapped
    L = core.layout
    tile = 14
    img = render_rgb_2d(core, tile=tile)
    dec = core.deception if isinstance(core.deception, dict) else core.deception()
    field, distractor = dec["field"], dec["distractor"]
    feats = [(f.kind, sorted(f.cells)) for f in L.features]
    doors = {k: (v.kind, v.tries) for k, v in L.doors.items()}
    # a short reward trace: the shaping pulls toward the distractor
    rng = np.random.default_rng(0)
    rewards = []
    for _ in range(60):
        _, r, term, trunc, info = env.step(int(rng.integers(3)))
        rewards.append(float(r))
        if term or trunc:
            break
    record("s03_features", {
        "config": kw, "reward_modes": ["none", "sparse", "coverage", "deceptive"],
        "start": L.start, "goal": L.goal, "distractor": distractor,
        "features": [(k, len(c)) for k, c in feats],
        "doors": {str(k): v for k, v in doors.items()},
        "horizon": core._max_steps, "optimal_actions": core.optimal_actions(),
        "betti_z2": list(core.topology.betti_z2),
        "betti_z2_sealed": list(core.topology.betti_z2_sealed),
        "sixty_random_steps_reward_sum": sum(rewards),
        "nonzero_rewards": sum(1 for r in rewards if r),
    })
    base = L.base

    def centre(cell):
        x, y = base.layout_coords(cell)
        return (x + 0.5) * tile, (y + 0.5) * tile

    def build(theme):
        t = THEMES[theme]
        fig, (a0, a1) = plt.subplots(1, 2, figsize=(11, 5.2), gridspec_kw={"wspace": 0.1})
        show_world(a0, img, "what the generator placed (reveal mode)")
        labels = {"chamber": "chamber", "decoy": "decoy", "hole": "hole"}
        for kind, cells in feats:
            cx = np.mean([centre(c)[0] for c in cells])
            cy = np.mean([centre(c)[1] for c in cells])
            a0.text(cx, cy, labels[kind], ha="center", va="center", fontsize=8, color="white",
                    bbox=dict(boxstyle="round,pad=0.2", fc=(0, 0, 0, 0.55), ec="none"))
        for cell, (kind, tries) in doors.items():
            x, y = centre(cell)
            a0.annotate(f"{kind} door ({tries} tries)", (x, y), (x - 2 * tile, y + 4 * tile),
                        fontsize=7.5, color=t["text"], ha="center",
                        arrowprops=dict(arrowstyle="-", color=t["text"], lw=0.7))
        for name, cell, col in (("start", L.start, "#3498db"), ("goal", L.goal, "#27ae60"),
                                ("distractor", distractor, "#e74c3c")):
            x, y = centre(cell)
            a0.plot(x, y, "o", ms=6, mfc="none", mec=col, mew=1.6)
            xw = img.shape[1]
            a0.text(x + (0.7 * tile if x < xw - 6 * tile else -0.7 * tile), y, name,
                    fontsize=7.5, color=col, va="center",
                    ha="left" if x < xw - 6 * tile else "right")
        back = grey(img, 0.5)
        vals = np.array(list(field.values()))
        norm = mcolors.Normalize(0, vals.max())
        cm = plt.get_cmap("magma_r")
        for cell, d in field.items():
            rgb = tuple(int(255 * c) for c in cm(norm(d))[:3])
            paint(back, base, [cell], rgb, tile, 0.9)
        show_world(a1, back, 'reward_mode="deceptive": shaping field d(cell, distractor)')
        for name, cell, col in (("goal", L.goal, "#27ae60"), ("distractor", distractor, "#ffffff")):
            x, y = centre(cell)
            a1.plot(x, y, "o", ms=7, mfc="none", mec=col, mew=1.8)
            xw = back.shape[1]
            a1.text(x + (0.7 * tile if x < xw - 6 * tile else -0.7 * tile), y, name,
                    fontsize=8, color=col, va="center",
                    ha="left" if x < xw - 6 * tile else "right")
        cb = fig.colorbar(plt.cm.ScalarMappable(norm=norm, cmap=cm), ax=a1,
                          fraction=0.046, pad=0.03)
        cb.outline.set_visible(False)
        cb.ax.tick_params(labelsize=7)
        cb.ax.set_title("d", fontsize=8)
        return fig
    save(build, "s03_features_deception")


# ----------------------------------------------------------------------------
# s05. Homology on the archive: VisitedComplex and the play overlay
# ----------------------------------------------------------------------------

def s05_archive():
    from topogym.baselines.gridworld2dv1.single_layout import COVERAGE_COLOR

    env = gym.make("TopoGym/Nested3-50-v0", seed=1, actions="fourway", max_steps=3000,
                   reward_mode="none")
    env.reset(seed=0)
    core = env.unwrapped
    rng = np.random.default_rng(0)
    for _ in range(3000):
        env.step(int(rng.integers(4)))
    seen_h = core.homology_stats("observed")
    visited_h = core.homology_stats("visited")
    reps = core.h1_representatives()   # per pocket: innermost visited cycle + rim
    from topogym.tda import VisitedComplex
    t0 = time.time()
    vc = VisitedComplex.from_env(env)
    vc_betti = vc.betti()
    vc_seconds = time.time() - t0
    backends = {
        "cubical": list(vc_betti),
        "vr_eps1.5": list(VisitedComplex.from_env(env, backend="vr",
                                                  epsilon=1.5).betti()),
        "witness": list(VisitedComplex.from_env(env, backend="witness").betti()),
    }
    record("s05_archive", {
        "backends": backends,
        "world": "TopoGym/Nested3-50-v0", "steps": 3000,
        "visited": len(core._visited),
        "visited_coverage": len(core._visited) / len(core.layout.free_cells),
        "seen_h1": seen_h.h1, "archive_h1": visited_h.h1,
        "VisitedComplex.betti()": list(vc_betti), "seconds": round(vc_seconds, 3),
        "pockets": [{"cycle": len(r["cycle"]), "rim": len(r["rim"]),
                     "pocket": len(r["pocket"])} for r in reps],
        "certified": list(core.topology.betti_z2),
    })
    tile = 14
    base = core.layout.base
    core.reveal_hidden = True
    canvas = render_rgb_2d(core, tile=tile)
    core.reveal_hidden = False
    # left: the seen space -- what the agent believes exists
    left = canvas.copy()
    unseen = [c for c in base.cells() if c not in core._observed_free]
    paint(left, base, unseen, (58, 66, 102), tile, 0.82)  # unseen: blue-grey, walls stay black
    paint(left, base, core._visited, COVERAGE_COLOR, tile, 0.35)
    # right: the archive space -- the visited (restorable) cells only
    right = grey(canvas, 0.5)
    paint(right, base, core._visited, COVERAGE_COLOR, tile, 0.5)
    for r in reps:
        paint(right, base, r["cycle"], (244, 208, 34), tile, 0.85)
        paint(right, base, r["rim"], (235, 60, 40), tile, 0.95)

    def build(theme):
        fig, (a0, a1) = plt.subplots(1, 2, figsize=(11, 5.6), gridspec_kw={"wspace": 0.06})
        show_world(a0, left, f"the seen space: h1 = {seen_h.h1} — nothing believed enclosed")
        show_world(a1, right,
                   f"the archive space: h1 = {visited_h.h1} pockets — "
                   "cycles (yellow), rims (red)")
        return fig
    save(build, "s05_archive_homology")


# ----------------------------------------------------------------------------
# s08. The certificate, as a table (text only)
# ----------------------------------------------------------------------------

def s08_certified():
    from topogym import registry

    env = gym.make("TopoGym/Grid2D-v0", base="torus", size=17, n_holes=2, n_chambers=1,
                   n_decoys=1, layout_seed=7)
    _, info = env.reset(seed=0)
    topo = dict(info["topology"])
    raw = env.unwrapped.free_betti()
    row = registry.manifest(ids=["TopoGym/Decoys4-50-v0"])[0]
    record("s08_certified", {"topology": topo, "free_betti_raw": list(raw),
                             "manifest_row": row})


DEMOS = {
    1: demo01,          # s01 gallery
    2: s01_build,       # s01 build-a-world gallery
    3: s02_dict_obs,    # s02 dict observation on plain / animated / Top envs
    4: demo03,          # s02 local vs vector
    5: s03_features,    # s03 goals, chambers, decoys, deception
    6: demo07,          # s04 teleport + archive gif
    7: demo05,          # s05 discovery + tracker barcode
    8: s05_archive,     # s05 VisitedComplex + play overlay
    9: demo06,          # s06 ricci
    10: demo08,         # s07 metrics dashboard
    11: s08_certified,  # s08 certificate (text only)
    12: demo02,         # s09 determinism triptych
    13: demo09,         # s09 benchmark (slow, cached)
    14: s10_sweep_study,  # s10 EpicChase k sweep, 1M steps per world
    15: outro,
    16: demo04,         # s01 distance fields
}


if __name__ == "__main__":
    wanted = [int(a) for a in sys.argv[1:]] or sorted(DEMOS)
    for k in wanted:
        print(f"\n=== demo {k} ===")
        DEMOS[k]()
    out = FIG / "outputs.json"
    if out.exists():
        merged = json.loads(out.read_text())
        merged.update(OUT)
    else:
        merged = OUT
    out.write_text(json.dumps(merged, indent=2, default=str))
    print(f"\nwrote {out}  total {time.time() - T0:.1f}s")
