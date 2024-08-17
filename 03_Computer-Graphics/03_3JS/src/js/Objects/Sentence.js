import { LetterA } from "./LetterA.js";
import { LetterN } from "./LetterN.js";
import { LetterD } from "./LetterD.js";
import { LetterO } from "./LetterO.js";
import { LetterR } from "./LetterR.js";
//
import { AnimationTimes } from "../Tools/AnimationTimes.js";

export class Sentence extends THREE.Group {
    //
    // Default Settings
    //
    static #text =  "andadora";
    //
    static #SIZE_WORD = 70;
    static #SIZE_LETTERS = 0.80 * Sentence.#SIZE_WORD;
    static #SIZE_SPACES  = 0.20 * Sentence.#SIZE_WORD;
    //
    static #POS_X = -10; // to center the word
    static #POS_Y = 0;
    static #POS_Z = 10;
    //
    static #COLOR = "hsl(50, 100%, 50%)";
    
    constructor(settings) {
        super();
        //
        //
        console.log("%c!!!", "color: crimson"); // separated, in case the browser does NOT support CSS text color in that instruction
        console.log("Supported letters: a-n-d-o-r");
        //
        //
        this.text = settings.text || Sentence.#text;
        //
        this.sizeWord = settings.sizeWord     || Sentence.#SIZE_WORD;
        this.sizeLetter = settings.sizeLetter || Sentence.#SIZE_LETTERS;
        this.sizeSpace = settings.sizeSpace   || Sentence.#SIZE_SPACES;
        //
        this.rot_x = settings.rot_x || 0;
        this.rot_y = settings.rot_y || -0.5 * Math.PI;
        this.rot_z = settings.rot_z || 0;
        //
        this.pos_x = settings.pos_x || Sentence.#POS_X;
        this.pos_y = settings.pos_y || Sentence.#POS_Y;
        this.pos_z = settings.pos_z || Sentence.#POS_Z;
        //
        this.first_pos_y = this.pos_y;
        
        this.animSpeed = 1;

        this.color = Sentence.#COLOR;
        //
        //
        this.#buildSentence();

        //
        // Definition of the TWEENs
        //

        // Translations
        this.goForward = new TWEEN.Tween(this.position)
            .to({ y: settings.targetAnimPos.y }, 1000 * 4)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(AnimationTimes.withoutSentence)
        ;
        this.goUp = new TWEEN.Tween(this.position)
            .to({ z: this.position.z + 10}, 1000 * 1)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(AnimationTimes.totalEntrance)
        ;
        this.goDown = new TWEEN.Tween(this.position)
            .to({ z: this.position.z }, 1000 * 1)
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;

        // Scalings
        this.getBiggerScaleX = new TWEEN.Tween(this.scale)
            .to({ x: this.scale.x + 1 }, 1000 * 2)
            .easing(TWEEN.Easing.Elastic.Out) 
            .delay(AnimationTimes.withoutSentence + AnimationTimes.sentenceEntrance) // Chaining TWEENs that control different things created unexpected behaviours
        ;
        this.getNormalScaleX = new TWEEN.Tween(this.scale)
            .to({ x: this.scale.x }, 1000 * 2)
            .easing(TWEEN.Easing.Elastic.Out)
            .onComplete(() => this.goUp.start())
        ;

        //
        // Starting the TWEENs
        //
        this.getBiggerScaleX.chain(this.getNormalScaleX);
        this.getBiggerScaleX.start();
        
        this.goForward.start();

        this.goUp.chain(this.goDown);
        this.goDown.chain(this.goUp);
    }

    #buildSentence() {
        const NUM_LETTERS = this.text.length;
        for (let i = 0; i < NUM_LETTERS; i++) {
            let letter = {};

            switch (this.text[i].toLowerCase()) {
                case "a": letter = new LetterA({color: this.color}); break;
                case "n": letter = new LetterN({color: this.color}); break;
                case "d": letter = new LetterD({color: this.color}); break;
                case "o": letter = new LetterO({color: this.color}); break;
                case "r": letter = new LetterR({color: this.color}); break;
                default: break; // the processUserInput() function already puts "d" instead of unsupported letters
            }
            //
            letter.rotation.set(this.rot_x,this.rot_y,this.rot_z);

            letter.position.x += i * (0.8 * this.sizeWord / NUM_LETTERS) + i * (0.2 * this.sizeWord / NUM_LETTERS);
            letter.position.x -= this.pos_x;
            letter.position.y += this.pos_y;
            letter.position.z += this.pos_z;

            this.add(letter);
        }
    }
}

