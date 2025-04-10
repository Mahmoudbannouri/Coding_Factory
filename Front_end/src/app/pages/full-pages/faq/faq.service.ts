import { Injectable } from '@angular/core';
import { FAQMain, FAQ } from './faq.model';

@Injectable()
export class FaqService {

  constructor() { }



  public faqsGettingStarted: FAQ[] = [
    new FAQ(
      'f1',
      'Purchasing process?',
      `Cheesecake cotton candy bonbon muffin cupcake tiramisu croissant. Tootsie roll sweet candy bear claw chupa
      chups lollipop toffee. Macaroon donut liquorice powder candy carrot cake macaroon fruitcake.
      Cookie toffee lollipop cotton candy ice cream dragée soufflé. Cake tiramisu lollipop wafer pie soufflé
      dessert tart. Biscuit ice cream pie apple pie topping oat cake dessert. Soufflé icing caramels.
      Chocolate cake icing ice cream macaroon pie cheesecake liquorice apple pie.`,
    ),
    new FAQ(
      'f2',
      'How secure is your payment?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll
      muffin powder donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin
      marzipan powder sugar plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops
       jelly cupcake. Caramels dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah
        gummi bears toffee powder.`,
    ),
    new FAQ(
      'f3',
      'How to apply for a prepaid card?',
      `Gingerbread liquorice liquorice cake muffin lollipop powder chocolate cake. Gummi bears lemon drops
      toffee liquorice pastry cake caramels chocolate bar brownie. Sweet biscuit chupa chups sweet. Halvah
      fruitcake gingerbread croissant dessert cupcake. Chupa chups chocolate bar donut tart. Donut cake dessert
       cookie. Ice cream tootsie roll powder chupa chups pastry cupcake soufflé.`,
    ),
    new FAQ(
      'f4',
      'How secure is my data in App?',
      `Icing sweet roll cotton candy brownie candy canes candy canes. Pie jelly dragée pie. Ice cream jujubes
      wafer. Wafer croissant carrot cake wafer gummies gummies chupa chups halvah bonbon. Gummi bears cotton candy
       jelly-o halvah. Macaroon apple pie dragée bonbon marzipan cheesecake. Jelly jelly beans marshmallow.`,
    ),
    new FAQ(
      'f5',
      'How do I know latest version?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f6',
      'Download documentation',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f7',
      'How secure is my personal info?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
        dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    )

  ]

  public faqsPricingPlans: FAQ[] = [
    new FAQ(
      'f1',
      'What is your purchasing process?',
      `Cheesecake cotton candy bonbon muffin cupcake tiramisu croissant. Tootsie roll sweet candy bear claw chupa
      chups lollipop toffee. Macaroon donut liquorice powder candy carrot cake macaroon fruitcake.
      Cookie toffee lollipop cotton candy ice cream dragée soufflé. Cake tiramisu lollipop wafer pie soufflé
      dessert tart. Biscuit ice cream pie apple pie topping oat cake dessert. Soufflé icing caramels.
      Chocolate cake icing ice cream macaroon pie cheesecake liquorice apple pie.`,
    ),
    new FAQ(
      'f2',
      'How rarely our information gets?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll
      muffin powder donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin
      marzipan powder sugar plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops
       jelly cupcake. Caramels dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah
        gummi bears toffee powder.`,
    ),
    new FAQ(
      'f3',
      'How to apply for an unknown card?',
      `Gingerbread liquorice liquorice cake muffin lollipop powder chocolate cake. Gummi bears lemon drops
      toffee liquorice pastry cake caramels chocolate bar brownie. Sweet biscuit chupa chups sweet. Halvah
      fruitcake gingerbread croissant dessert cupcake. Chupa chups chocolate bar donut tart. Donut cake dessert
       cookie. Ice cream tootsie roll powder chupa chups pastry cupcake soufflé.`,
    ),
    new FAQ(
      'f4',
      'How secure is data and info in App?',
      `Icing sweet roll cotton candy brownie candy canes candy canes. Pie jelly dragée pie. Ice cream jujubes
      wafer. Wafer croissant carrot cake wafer gummies gummies chupa chups halvah bonbon. Gummi bears cotton candy
       jelly-o halvah. Macaroon apple pie dragée bonbon marzipan cheesecake. Jelly jelly beans marshmallow.`,
    ),
    new FAQ(
      'f5',
      'How do I know about modest version?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f6',
      'Download offline documentation',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f7',
      'Secure personal data?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
        dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    )

  ]

  public faqsSalesQues: FAQ[] = [
    new FAQ(
      'f1',
      'Detailed sales process',
      `Cheesecake cotton candy bonbon muffin cupcake tiramisu croissant. Tootsie roll sweet candy bear claw chupa
      chups lollipop toffee. Macaroon donut liquorice powder candy carrot cake macaroon fruitcake.
      Cookie toffee lollipop cotton candy ice cream dragée soufflé. Cake tiramisu lollipop wafer pie soufflé
      dessert tart. Biscuit ice cream pie apple pie topping oat cake dessert. Soufflé icing caramels.
      Chocolate cake icing ice cream macaroon pie cheesecake liquorice apple pie.`,
    ),
    new FAQ(
      'f2',
      'What you sale?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll
      muffin powder donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin
      marzipan powder sugar plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops
       jelly cupcake. Caramels dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah
        gummi bears toffee powder.`,
    ),
    new FAQ(
      'f3',
      'How to apply for a sales card?',
      `Gingerbread liquorice liquorice cake muffin lollipop powder chocolate cake. Gummi bears lemon drops
      toffee liquorice pastry cake caramels chocolate bar brownie. Sweet biscuit chupa chups sweet. Halvah
      fruitcake gingerbread croissant dessert cupcake. Chupa chups chocolate bar donut tart. Donut cake dessert
       cookie. Ice cream tootsie roll powder chupa chups pastry cupcake soufflé.`,
    ),
    new FAQ(
      'f4',
      'How secure is my data in sales App?',
      `Icing sweet roll cotton candy brownie candy canes candy canes. Pie jelly dragée pie. Ice cream jujubes
      wafer. Wafer croissant carrot cake wafer gummies gummies chupa chups halvah bonbon. Gummi bears cotton candy
       jelly-o halvah. Macaroon apple pie dragée bonbon marzipan cheesecake. Jelly jelly beans marshmallow.`,
    ),
    new FAQ(
      'f5',
      'How do I know sales?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f6',
      'Download offline sales documentation',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f7',
      'How secure is my sales information?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
        dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    )

  ]

  public faqsUsageGuide: FAQ[] = [
    new FAQ(
      'f1',
      'Purchasing user process',
      `Cheesecake cotton candy bonbon muffin cupcake tiramisu croissant. Tootsie roll sweet candy bear claw chupa
      chups lollipop toffee. Macaroon donut liquorice powder candy carrot cake macaroon fruitcake.
      Cookie toffee lollipop cotton candy ice cream dragée soufflé. Cake tiramisu lollipop wafer pie soufflé
      dessert tart. Biscuit ice cream pie apple pie topping oat cake dessert. Soufflé icing caramels.
      Chocolate cake icing ice cream macaroon pie cheesecake liquorice apple pie.`,
    ),
    new FAQ(
      'f2',
      'How secure are legal rights?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll
      muffin powder donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin
      marzipan powder sugar plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops
       jelly cupcake. Caramels dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah
        gummi bears toffee powder.`,
    ),
    new FAQ(
      'f3',
      'How to write for a postpaid card?',
      `Gingerbread liquorice liquorice cake muffin lollipop powder chocolate cake. Gummi bears lemon drops
      toffee liquorice pastry cake caramels chocolate bar brownie. Sweet biscuit chupa chups sweet. Halvah
      fruitcake gingerbread croissant dessert cupcake. Chupa chups chocolate bar donut tart. Donut cake dessert
       cookie. Ice cream tootsie roll powder chupa chups pastry cupcake soufflé.`,
    ),
    new FAQ(
      'f4',
      'How secure is my info in App?',
      `Icing sweet roll cotton candy brownie candy canes candy canes. Pie jelly dragée pie. Ice cream jujubes
      wafer. Wafer croissant carrot cake wafer gummies gummies chupa chups halvah bonbon. Gummi bears cotton candy
       jelly-o halvah. Macaroon apple pie dragée bonbon marzipan cheesecake. Jelly jelly beans marshmallow.`,
    ),
    new FAQ(
      'f5',
      'How do write about latest?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f6',
      'Download offline sales doc',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f7',
      'How secure is your personal information?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
        dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    )

  ]

  public faqsGeneralGuide: FAQ[] = [
    new FAQ(
      'f1',
      'How to write process?',
      `Cheesecake cotton candy bonbon muffin cupcake tiramisu croissant. Tootsie roll sweet candy bear claw chupa
      chups lollipop toffee. Macaroon donut liquorice powder candy carrot cake macaroon fruitcake.
      Cookie toffee lollipop cotton candy ice cream dragée soufflé. Cake tiramisu lollipop wafer pie soufflé
      dessert tart. Biscuit ice cream pie apple pie topping oat cake dessert. Soufflé icing caramels.
      Chocolate cake icing ice cream macaroon pie cheesecake liquorice apple pie.`,
    ),
    new FAQ(
      'f2',
      'How secure is your gateway information?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll
      muffin powder donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin
      marzipan powder sugar plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops
       jelly cupcake. Caramels dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah
        gummi bears toffee powder.`,
    ),
    new FAQ(
      'f3',
      'How to apply for a detail?',
      `Gingerbread liquorice liquorice cake muffin lollipop powder chocolate cake. Gummi bears lemon drops
      toffee liquorice pastry cake caramels chocolate bar brownie. Sweet biscuit chupa chups sweet. Halvah
      fruitcake gingerbread croissant dessert cupcake. Chupa chups chocolate bar donut tart. Donut cake dessert
       cookie. Ice cream tootsie roll powder chupa chups pastry cupcake soufflé.`,
    ),
    new FAQ(
      'f4',
      'How secure is opensource?',
      `Icing sweet roll cotton candy brownie candy canes candy canes. Pie jelly dragée pie. Ice cream jujubes
      wafer. Wafer croissant carrot cake wafer gummies gummies chupa chups halvah bonbon. Gummi bears cotton candy
       jelly-o halvah. Macaroon apple pie dragée bonbon marzipan cheesecake. Jelly jelly beans marshmallow.`,
    ),
    new FAQ(
      'f5',
      'How do I know about oldest version?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f6',
      'Download offline sales doc',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
         dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    ),
    new FAQ(
      'f7',
      'How secure is my personal data?',
      `Pie pudding candy. Oat cake jelly beans bear claw lollipop. Ice cream candy canes tootsie roll muffin powder
       donut powder. Topping candy canes chocolate bar lemon drops candy canes. Halvah muffin marzipan powder sugar
        plum donut donut cotton candy biscuit. Wafer jujubes apple pie sweet lemon drops jelly cupcake. Caramels
        dessert halvah marshmallow. Candy topping cotton candy oat cake croissant halvah gummi bears toffee powder.`,
    )

  ]

  public faqmain: FAQMain[] = [
    new FAQMain(
      0,
      'Getting Started',
      `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit alias voluptas aspernatur maiores quis molestiae totam deserunt exercitationem ipsam officiis nisi, labore magni, commodi quaerat quia earum quas illo ea amet minus ad dolor?`,
      this.faqsGettingStarted
    ),
    new FAQMain(
      1,
      'Pricing & Plans',
      `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit alias voluptas aspernatur maiores quis molestiae totam deserunt exercitationem ipsam officiis nisi, labore magni, commodi quaerat quia earum quas illo ea amet minus ad dolor?`,
      this.faqsPricingPlans
    ),
    new FAQMain(
      2,
      'Sales Question',
      `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit alias voluptas aspernatur maiores quis molestiae totam deserunt exercitationem ipsam officiis nisi, labore magni, commodi quaerat quia earum quas illo ea amet minus ad dolor?`,
      this.faqsSalesQues
    ),
    new FAQMain(
      3,
      'Usage Guides',
      `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit alias voluptas aspernatur maiores quis molestiae totam deserunt exercitationem ipsam officiis nisi, labore magni, commodi quaerat quia earum quas illo ea amet minus ad dolor?`,
      this.faqsUsageGuide
    ),
    new FAQMain(
      4,
      'General Guide',
      `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reprehenderit alias voluptas aspernatur maiores quis molestiae totam deserunt exercitationem ipsam officiis nisi, labore magni, commodi quaerat quia earum quas illo ea amet minus ad dolor?`,
      this.faqsGeneralGuide
    ),
  ];
}
