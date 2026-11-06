import { site } from '../data/site'
import type { Review } from '../data/site'
import { Reveal, SectionLabel } from './Shared'
import DragRail from './DragRail'
import Wave from './Wave'

function ReviewCard({ review }: { review: Review }) {
  return <figure className="review-card"><blockquote><p>{review.text}</p></blockquote><figcaption><span>{review.author}</span>{review.context && <small>{review.context}</small>}</figcaption></figure>
}

export default function Reviews() {
  const reviews = site.reviews.items
  return <section id="avaliacoes" className={`section reviews-section ${reviews.length ? 'has-reviews' : ''}`} aria-labelledby="reviews-title">
    <div className="shell">
      <Reveal className="reviews-heading"><div><SectionLabel>{site.reviews.label}</SectionLabel><h2 id="reviews-title">{site.reviews.title}</h2></div>
        {!reviews.length && <p className="reviews-empty">{site.reviews.empty}</p>}
      </Reveal>
      {reviews.length === 1 && <div className="review-single"><ReviewCard review={reviews[0]} /></div>}
      {reviews.length > 1 && <DragRail label={site.ui.reviewsRail} className="reviews-rail">{reviews.map(review => <ReviewCard key={review.id} review={review} />)}</DragRail>}
    </div>
    <Wave next="dark" />
  </section>
}
