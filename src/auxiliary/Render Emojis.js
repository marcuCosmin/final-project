import React from 'react';
import {emojis_style} from '../styles/Style.module.css';

export default function Emojis() {

    const emojiRange = [[128512, 128591], [9986, 10145], [128640, 128702]];

    const emojis = [];

    for (const array of emojiRange) {

        for (let number = array[0]; number < array[array.length - 1]; number++) {

            emojis.push((`${number}`));

        }
    }

    return (

        <div className="w-100 mt-3">

            {emojis.map((emoji) => <input type="button" className={`p-1 ${emojis_style}`} onClick={function() {console.log('e')}} name={emoji} value={String.fromCodePoint(emoji)} key={emoji}/>)}

        </div>
    )
}
