import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { getSessionUser, signOut } from '@/data/auth';

export default function UtilityBar() {
  const { items } = useCart();
  const totalCartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const user = getSessionUser();

  return (
    <div className='utility-bar'>
      <div className='utility-bar__inner container'>
        <ul className='utility-bar__menu'>
          <li>
            <Link to="/mypage" className="utility-bar__link">
              <strong className="utility-bar__name">{user?.name}</strong>님
            </Link>
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
            <Link to="/login" className="utility-bar__link" onClick={signOut}>
              로그아웃
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
