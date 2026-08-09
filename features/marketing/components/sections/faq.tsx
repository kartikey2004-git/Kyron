import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionShell } from "../page-frame";
import { faqs, siteLinks } from "../data";

export function Faq() {
  return (
    <SectionShell className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8">
        <p className="text-[12px] text-brand-accent">FAQs</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Frequently asked questions
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Everything worth asking before you connect a repository. Still
          couldn&apos;t find what you&apos;re looking for?
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-9 rounded-[10px] border-hairline px-5 text-sm font-medium dark:border-border"
          >
            <a href={siteLinks.docs} target="_blank" rel="noopener noreferrer">
              Read docs
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-9 rounded-[10px] border-hairline px-5 text-sm font-medium dark:border-border"
          >
            <a
              href={`${siteLinks.github}/issues`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open an issue
            </a>
          </Button>
        </div>
      </div>

      <div className="px-6 pb-16 lg:px-8">
        <Accordion
          type="single"
          collapsible
          className="border-t border-hairline dark:border-white/10"
        >
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border-b border-hairline dark:border-white/10"
            >
              <AccordionTrigger className="py-5 text-[14px] font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="pb-5 text-[13px] leading-[1.6] text-stone">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionShell>
  );
}
