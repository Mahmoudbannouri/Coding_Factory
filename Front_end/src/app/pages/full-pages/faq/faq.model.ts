export class FAQ {
    public faqId: string;
    public title: string;
    public content: string;

    constructor(faqId: string, title:string, content: string) {
      this.faqId = faqId;
      this.title = title;
      this.content = content;
    }
  }

  export class FAQMain {
    public typeId: number;
    public title: string;
    public content: string;
    public faqs: FAQ[];

    constructor(typeId: number, title:string, content: string, faqs: FAQ[]) {
      this.typeId = typeId;
      this.title = title;
      this.content = content;
      this.faqs = faqs;
    }
  }
