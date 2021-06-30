// animations.ts
import { trigger, state, style, transition, animate } from '@angular/animations';

export const POPAnimation = [
  trigger('addItems', [
    state('open', style({
      transform: 'translateY(0)'
    })),
    state('closed', style({
      bottom: 'initial',
      top: '50px'
    })),
    transition('open <=> closed', animate(300))
  ]),
  trigger('widthGrowFunction', [
    state('activeState', style({
      width: '100px'
    })),
    transition('* => *', animate(300))
  ]),
  trigger('widthGrowPOP', [
    state('open', style({
      width: '200px',
      left: '100px'
    })),
    state('activeState', style({
      width: '100px',
      left: '100px'
    })),
    transition('* => *', animate(300))
  ]),
  trigger('widthGrowEndpoint', [
    state('open', style({
      left: '210px'
    })),
    state('activeState', style({
      width: '100px',
      left: '300px'
    })),
    transition('* => *', animate(300))
  ])
];