import { sayHello } from './greet';

const showHello = async (divName: string, name: string) => {
  const elt = document.getElementById(divName);
  elt.innerText = await sayHello(name);
  console.log('324 ');
};

showHello('greeting', 'TypeScript');
