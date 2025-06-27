
import sprite_border from '@/assets/image/sprite/border_sprite.png';

export class Css {
  static borderStyle: React.CSSProperties = {
    border: '25px solid transparent',
    padding: '15px',
    borderImage: `url(${sprite_border}) 30%`,
  };
}