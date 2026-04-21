export type BCDoc = {
  id: string;
  topic: "Master Data" | "Navigation" | "Sales";
  title: string;
  content: string;
};

export type ScoredBCDoc = {
  doc: BCDoc;
  score: number;
};

export const bcDocs: BCDoc[] = [
  {
    id: "md-item-card",
    topic: "Master Data",
    title: "Item Card and Inventory Posting Groups",
    content:
      "In Dynamics 365 Business Central, the Item Card governs replenishment behavior, costing method, base unit of measure, and inventory posting groups. Mapping General Product Posting Group and VAT Product Posting Group correctly ensures sales invoice posting to the right G/L accounts."
  },
  {
    id: "md-customer-template",
    topic: "Master Data",
    title: "Customer Templates and Posting Setup",
    content:
      "Customer templates speed onboarding by pre-filling Payment Terms Code, Customer Posting Group, Currency Code, and Shipment Method Code. Incorrect Customer Posting Group mapping can cause posting errors during sales order invoicing."
  },
  {
    id: "nav-role-center",
    topic: "Navigation",
    title: "Role Centers and Tell Me Search",
    content:
      "Role Centers personalize Business Central by surfacing cues, actions, and lists relevant to a profile such as Sales Order Processor. The Tell Me search locates pages, reports, and setup entries quickly, reducing navigation friction in high-volume operations."
  },
  {
    id: "nav-dimensions",
    topic: "Navigation",
    title: "Dimensions in Document Flow",
    content:
      "Shortcut dimensions can be assigned at header and line level in sales documents. During posting, dimensions flow to G/L entries, customer ledger entries, and value entries, enabling department and project profitability analysis in Power BI."
  },
  {
    id: "sales-order-lifecycle",
    topic: "Sales",
    title: "Sales Order Lifecycle",
    content:
      "A sales order transitions from Open to Released before warehouse handling and posting. Posting options include Ship, Invoice, or Ship and Invoice. The posting routine creates item ledger, value entries, VAT entries, and customer ledger entries based on setup."
  },
  {
    id: "sales-pricing-discounts",
    topic: "Sales",
    title: "Sales Price Lists and Line Discounts",
    content:
      "Modern pricing in Business Central uses price lists with conditions such as customer, currency, minimum quantity, and date validity. Priority rules determine final unit price and line discount, then the system recalculates line amount and invoice discount."
  }
];

export function retrieveBCContext(query: string, max = 3): ScoredBCDoc[] {
  const q = query.toLowerCase();
  const scored = bcDocs.map((doc) => {
    const hay = `${doc.title} ${doc.content}`.toLowerCase();
    let score = 0;
    for (const token of q.split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 1;
    }
    if (hay.includes("sales") && q.includes("sales")) score += 2;
    if (hay.includes("master") && q.includes("master")) score += 2;
    if (hay.includes("navigation") && q.includes("navigation")) score += 2;
    return { doc, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, max);
}
