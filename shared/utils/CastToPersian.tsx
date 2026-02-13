"use client";
import { useEffect } from "react";

const toFaDigits = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export default function GlobalFaDigits() {
  useEffect(() => {
    const skipTags = new Set(["INPUT", "TEXTAREA", "SCRIPT", "STYLE", "CODE", "PRE"]);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    const convertNode = (n: Node) => {
      const p = n.parentElement;
      if (!p || skipTags.has(p.tagName)) return;
      // Skip any subtree explicitly marked to keep Latin digits
      if (p.closest("[data-latin-digits]")) return;
      const txt = n.nodeValue ?? "";
      const converted = toFaDigits(txt);
      if (converted !== txt) n.nodeValue = converted;
    };

    for (let n = walker.nextNode(); n; n = walker.nextNode()) convertNode(n);

    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "characterData") {
          convertNode(m.target as Node);
        } else if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) convertNode(node);
            else if ((node as Element).querySelectorAll) {
              const tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
              for (let x = tw.nextNode(); x; x = tw.nextNode()) convertNode(x);
            }
          });
        }
      }
    });

    obs.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return null;
}
