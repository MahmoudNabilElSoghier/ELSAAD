import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center">
      <Container size="md" className="py-24 text-center">
        <p className="text-6xl font-extrabold text-accent mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-muted mb-8">الرابط اللي بتدور عليه مش موجود.</p>
        <Button size="lg" asChild>
          <Link href="/">ارجع للرئيسية</Link>
        </Button>
      </Container>
    </main>
  );
}
