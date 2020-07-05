import { sayHello } from './greet';
import { pay } from 'report';

const showHello = async (divName: string, name: string) => {
  const elt = document.getElementById(divName);
  elt.innerText = await sayHello(name);
  console.log('324 13');
};

showHello('greeting', 'TypeScript');
