import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section text-center">
      <div className="container">
        <h1 className="display">Wrong turn, brother.</h1>
        <p className="lead" style={{ marginBottom: 24 }}>
          That page doesn’t exist.
        </p>
        <Link className="btn" to="/">
          Back to the comeback →
        </Link>
      </div>
    </section>
  );
}
