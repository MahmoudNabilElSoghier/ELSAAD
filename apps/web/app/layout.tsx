// Root layout fallback (next-intl pattern): the real <html>/<body> shell lives
// in app/[locale]/layout.tsx. Routes rendered outside [locale] (none currently
// render UI) pass through unchanged.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
