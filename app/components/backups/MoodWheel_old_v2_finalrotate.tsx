import { promises as fs } from 'fs';

import 'react';

// allows the use of css variables in tsx components
declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}


export default async function MoodWheel() {
    const file = await fs.readFile(process.cwd() + '/app/moods.json', 'utf8');
    const data = JSON.parse(file);


    const degrees = 360;
    const degree_increment = degrees / data.primary.length;

    const primary_degree_totalchars = data.primary.reduce((total: number, word: string) => total + word.length, 0);

    

    const primary_characters = data.primary.map((word:string) => word.length);



    const moods = data.primary.map((mood: string, primary_index: number) => (  

        //rotate: `${degree_increment*(primary_index)}deg`
        <li className={`flex flex-col-reverse font-mono [rotate:calc(var(--rotate-max)*1deg)]`} key={`primary-${primary_index}`} style={{"--rotate-max": `${degree_increment*(primary_index+1)}`, backgroundColor: `hsl(${degree_increment*(primary_index+1)} 100% 50%)`}}>
            

            <ul className='flex justify-center font-black' style={{"--count": mood.split('').length}}>
             {mood.split('').map((char: string, index: number) => 
                <p key={`char-${primary_index}.${index}`} className='rotate-[var(--final-rotate)]' style={{"--index": index+1, "--final-rotate": "calc(((var(--rotate-max) - var(--rotate-dif)) + (var(--rotate-dif) * (var(--index) / var(--count)))) * 1deg)"}}>{char}</p>
            )}
            </ul>


            <ul className=''>
                {data.secondary[mood].map((secondary_mood: string, secondary_index: number) => (
                    <li key={`secondary-${primary_index}-${secondary_index}`} className=''>
                        {secondary_mood}
                    </li>
                ))}
            </ul>
        </li>
    ));

    return (    
        <ul id='the-wheel' className={`flex flex-col relative [&>*]:absolute [&>*]:-translate-y-1/2 [&>*]:translate-x-1/2 /[&>*]:h-[260px] [&>*]:grow'`} style={{"--total": primary_degree_totalchars, "--rotate-dif":`${degree_increment}`}}>
            {moods}

            {primary_degree_totalchars}
        </ul>
    );
}