import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-ash-800 border-t border-ash-200 py-10 text-center text-sm text-ash-600 dark:border-white/10 dark:text-ash-300">
      <Container>
        <p>© {new Date().getFullYear()} Michelle Fashion Academy • All rights reserved.</p>
      </Container>
    </footer>
  );
}