import { FC } from 'react';
import { useRouter } from 'next/navigation';

const Header: FC = () => {
  const router = useRouter();

  return (
    <header className="w-full flex justify-center py-6 bg-white shadow-sm">
      <h1 className="text-2xl font-bold font-montserrat text-green-teal tracking-normal cursor-pointer" onClick={() => router.push('/')}>
        SWStarter
      </h1>
    </header>
  );
}

export default Header;
