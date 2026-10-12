import { Fragment } from "react";

/**
 * Renders translated strings that use *asterisks* to mark the emphasised phrase:
 *   "Your path to an *Australian* education" -> Your path to an <em>Australian</em> education
 */
export function Rich({ text, em = "not-italic text-accent-600" }: { text: string; em?: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 ? (
          <em key={i} className={em}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
