import { useEffect, useState } from 'react';
import { PomeriumVerifier } from '@pomerium/pomerium-js-sdk';

function App() {

  const [jwt, setJwt ] = useState('');

  useEffect(() => {
    const jwtVerifier = new PomeriumVerifier({
      issuer: 'authenticate.localhost.pomerium.io:4443',
      audience: 'react.localhost.pomerium.io',
      expirationBuffer: 1000
    });
    jwtVerifier.verifyBrowserUser()
      .then(r => setJwt(r))
      .catch(e => console.log(e));
  }, [])

  return (
    <div>
      <pre>{JSON.stringify(jwt, null, 2)}</pre>
    </div>
  );
}

export default App;
