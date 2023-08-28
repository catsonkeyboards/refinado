import Head from 'next/head';
import Logo from 'app/components/Logo';

const Home = () => {
  return (
    <div>
      <Head>
        <title>My Custom Next.js App</title>
      </Head>
      <main>
        <Logo />
        <h1>Welcome to My Custom Next.js App!</h1>
        <p>This is the homepage.</p>
    </main>
    </div >
  );
};

export default Home;
