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
 

    const primary_degree_totalchars = data.primary.reduce((total: number, word: string) => total + word.length, 0) + data.primary.length;
    // const primary_degree_totalchars = data.primary.reduce((total: number, word: string) => total + word.length, 0);


    const primary_letter_increment = degrees / primary_degree_totalchars;

    

    const primary_characters = data.primary.map((word:string) => word.length);

    let runningIndex = 0;
    // let rotationArray = [];


    const moods = data.primary.map((mood: string, primary_index: number) => {
        const charCount = mood.length;
        const indexOffset = runningIndex;

        // plus one to compensate for the spaces
        runningIndex += charCount + 1;
        

        // rotationArray.push(primary_letter_increment * (runningIndex));


        return (
            <li 
                className="flex flex-col-reverse font-mono /[rotate:calc(var(--rotate-max)*1deg)] relative" 
                key={`primary-${primary_index}`} 
                style={{ 
                    // "--rotate-min": `${primary_letter_increment * (charCount)}`,
                    "--rotate-max": `${primary_letter_increment * (runningIndex)}`, 
                    backgroundColor: `hsl(${degree_increment * (primary_index + 1)} 100% 50%)` 
                }}
            >
                <ul className="flex justify-center font-black" style={{ "--count": runningIndex+1}}>
                    {mood.split('').map((char: string, index: number) => (
                        <p 
                            key={`char-${primary_index}.${index}`} 
                            className="rotate-[var(--final-rotate)]" 
                            style={{ 
                                "--index": indexOffset + index, 
                                "--inner_index": index,
                                "--final-rotate": `[transform:translate(-50%,-50%)_rotate(calc((var(--rotate-max) / var(--total)) * var(--index) * 1deg))_translateY(calc(var(--radius,5)*-1ch))]`
                                // "--final-rotate": `/calc(((var(--rotate-max)) + (var(--rotate-dif) * (var(--inner_index) / var(--count)))) * 1deg)` 
                            }}
                        >
                            {char}
                        </p>
                    ))}
                    

                    <p 
                        key={`char-${primary_index}.space`} 
                        className='rotate-[var(--final-rotate)]' 
                        style={{ 
                            "--index": indexOffset + charCount, 
                            "--final-rotate": `[transform:translate(-50%,-50%)_rotate(calc((var(--rotate-max) / var(--total)) * var(--index) * 1deg))_translateY(calc(var(--radius,5)*-1ch))]`
                        }}
                    >
                        {' '}
                    </p>
                </ul>
    
                <ul className="absolute flex flex-col hidden" style={{ "--secondary_count": data.secondary[mood].length }}>
                    {data.secondary[mood].map((secondary_mood: string, secondary_index: number) => (
                       
                            <p 
                                key={`char-${primary_index}.${secondary_index}`} 
                                className="rotate-[var(--final-rotate)]" 
                                style={{ 
                                    "--index": indexOffset + secondary_index, 
                                    "--inner_index": secondary_index,
                                    "--final-rotate": `[transform:translate(-50%,-50%)_rotate(calc((var(--rotate-max) / var(--total)) * var(--index) * 1deg))_translateY(calc(var(--radius,5)*-1ch))]` 
                                }}
                            >
                                {secondary_mood}
                            </p>
                        ))
                    }
                </ul>
            </li>
        );
        
    });

    return (    
        <ul id='the-wheel' className={`relative [&>*]:absolute translate-x-1/2 /[&>*]:h-[260px] /[&>*]:grow'`} style={{"--radius": 6.7 / Math.sin(degree_increment / (180 / Math.PI)), "--total": primary_degree_totalchars, "--rotate-dif":`${degree_increment}`}}>
            {moods}

            {/* {primary_degree_totalchars} */}

            {/* {primary_letter_increment} */}
        </ul>
    );
}