export class KnowledgeBase {
  kbId: string;
  name: string;
  content: string;
  icon: string;


  constructor(kbId: string, name: string, content: string, icon: string) {
    this.kbId = kbId;
    this.name = name;
    this.content = content;
    this.icon = icon;
  }

}


export class KBCategory {
  kbCategoryId: string;
  name: string;
  content: string;
  tooltips: CategoryTooltips[];
  text: string;

  constructor(kbCategoryId: string, name: string, content: string, tooltips: CategoryTooltips[], text: string) {
    this.kbCategoryId = kbCategoryId;
    this.name = name;
    this.content = content;
    this.tooltips = tooltips;
    this.text = text;
  }

}

export class CategoryTooltips {
  avatar: string;
  name: string;

  constructor(avatar: string, name: string) {
    this.avatar = avatar;
    this.name = name;
  }

}
