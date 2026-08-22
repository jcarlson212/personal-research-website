/* ============================================================================
   Acknowledgements — people who have helped my career. Rendered in the order
   listed here; `note` and `link` are optional.
   ========================================================================== */

export interface Acknowledgement {
  name: string
  /** One-line context: what they did. */
  note?: string
  /** Optional URL (homepage, lab page, profile). */
  link?: string
  /** Optional photo, served from public/ (e.g. "/acknowledgements/name.jpg"). */
  photo?: string
  /** Alt text for the photo. */
  photoAlt?: string
}

export const acknowledgementsIntro =
  'Each person below helped my career.'

export const acknowledgements: Acknowledgement[] = [
  {
    name: 'Tarik Arici',
    photo: '/acknowledgements/tarik-arici.jpg',
    photoAlt: 'Tarik and me out at dinner.',
    note:
      'Helped me win a hackathon by training an ML model with contrastive learning overnight, and has since helped with fellowship applications and an arXiv endorsement.',
  },
  {
    name: 'Jaspreet Singh',
    note: 'Encouraged me, when things looked bleak, to deploy a BERT model on Inferentia.',
  },
  {
    name: 'Anselm Blumer',
    note:
      'Mentored me as an independent researcher, helping me get a visiting researcher position at NYU and apply to fellowships.',
  },
  {
    name: 'Jack Spielberg',
    note: 'Pushed me to be more serious with high-level math, despite my bad habits at the time.',
  },
  {
    name: 'Rishav Agarwal',
    note: 'My first Amazon SDE manager, who pushed me and gave me the freedom to build cool ML systems.',
  },
]
