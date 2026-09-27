import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

export default function UtilityBar() {
  const { items } = useCart();
  const totalCartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className='utility-bar'>
      <div className='utility-bar__inner container'>
        <ul className='utility-bar__menu'>
          <li>
            <a href='javascript:;' className='utility-bar__link'>
              <strong className='utility-bar__name'>김민서</strong>님
            </a>
          </li>
          <li>
            <Link to='/cart' className='utility-bar__link'>
              장바구니 <strong className='utility-bar__cart-count'>({totalCartCount})</strong>
            </Link>
          </li>
          <li>
            <a href="javascript:;" className="utility-bar__link">
              주문
            </a>
          </li>
          <li>
            <a href="javascript:;" className="utility-bar__link">
              로그아웃
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
