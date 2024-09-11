import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as CodeMirror from "codemirror";
import { count } from 'console';

// Remember to rename these classes and interfaces!

const ruToEn: Record<string, string>  = {
	'ё': '`',
	'Ё': '~',
	'"': '@',
	'№': '#',
	';': '$',
	':': '^',
	'?': '&',
	'й': 'q',
	'Й': 'Q',
	'ц': 'w',
	'Ц': 'W',
	'у': 'e',
	'У': 'E',
	'к': 'r',
	'К': 'R',
	'е': 't',
	'Е': 'T',
	'н': 'y',
	'Н': 'Y',
	'г': 'u',
	'Г': 'U',
	'ш': 'i',
	'Ш': 'I',
	'щ': 'o',
	'Щ': 'O',
	'з': 'p',
	'З': 'P',
	'х': '[',
	'Х': '{',
	'ъ': ']',
	'Ъ': '}',
	'/': '|',
	'ф': 'a',
	'Ф': 'A',
	'ы': 's',
	'Ы': 'S',
	'в': 'd',
	'В': 'D',
	'а': 'f',
	'А': 'F',
	'п': 'g',
	'П': 'G',
	'р': 'h',
	'Р': 'H',
	'о': 'j',
	'О': 'J',
	'л': 'k',
	'Л': 'K',
	'д': 'l',
	'Д': 'L',
	'ж': ';',
	'Ж': ':',
	'э': '\'',
	'Э': '"',
	'я': 'z',
	'Я': 'Z',
	'ч': 'x',
	'Ч': 'X',
	'с': 'c',
	'С': 'C',
	'м': 'v',
	'М': 'V',
	'и': 'b',
	'И': 'B',
	'т': 'n',
	'Т': 'N',
	'ь': 'm',
	'Ь': 'M',
	'б': ',',
	'Б': '<',
	'ю': '.',
	'Ю': '>',
	'.': '/',
	',': '?',
};

const enToRu: Record<string, string> = {
	'`': 'ё',
	'~': 'Ё',
	'@': '"',
	'#': '№',
	'$': ';',
	'^': ':',
	'&': '?',
	'q': 'й',
	'Q': 'Й',
	'w': 'ц',
	'W': 'Ц',
	'e': 'у',
	'E': 'У',
	'r': 'к',
	'R': 'К',
	't': 'е',
	'T': 'Е',
	'y': 'н',
	'Y': 'Н',
	'u': 'г',
	'U': 'Г',
	'i': 'ш',
	'I': 'Ш',
	'o': 'щ',
	'O': 'Щ',
	'p': 'з',
	'P': 'З',
	'[': 'х',
	'{': 'Х',
	']': 'ъ',
	'}': 'Ъ',
	'|': '/',
	'a': 'ф',
	'A': 'Ф',
	's': 'ы',
	'S': 'Ы',
	'd': 'в',
	'D': 'В',
	'f': 'а',
	'F': 'А',
	'g': 'п',
	'G': 'П',
	'h': 'р',
	'H': 'Р',
	'j': 'о',
	'J': 'О',
	'k': 'л',
	'K': 'Л',
	'l': 'д',
	'L': 'Д',
	';': 'ж',
	':': 'Ж',
	'\'': 'э',
	'"': 'Э',
	'z': 'я',
	'Z': 'Я',
	'x': 'ч',
	'X': 'Ч',
	'c': 'с',
	'C': 'С',
	'v': 'м',
	'V': 'М',
	'b': 'и',
	'B': 'И',
	'n': 'т',
	'N': 'Т',
	'm': 'ь',
	'M': 'Ь',
	',': 'б',
	'<': 'Б',
	'.': 'ю',
	'>': 'Ю',
	'/': '.',
	'?': ',',
};

const specialSymbol = ['/', '']


export default class TranslateKeyboard extends Plugin {

	async onload() {

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'translating-keyboard',
			name: 'Translating keyboard from selection',
			callback: () => this.TranslateBlock()
		});

		this.addCommand({
			id: 'translating-to-ru',
			name: 'Translating keyboard to Ru from selection',
			callback: () => this.TranslateBlockToRu()
		});

		this.addCommand({
			id: 'translating-to-en',
			name: 'Translating keyboard to En from selection',
			callback: () => this.TranslateBlockToEn()
		});
	}


	TranslateBlock(): void {
		let activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			let editor = activeView.editor;
			let selectedText = editor.getSelection();
			let text = '';
			let controlChars = [selectedText.charAt(0), selectedText.charAt(selectedText.length-1), selectedText.charAt(selectedText.length / 2 >> 0)];
			let countRu = 0;
			let countEn = 0;
			for (let i = 0; i < controlChars.length; i++) {
				if (controlChars[i] in ruToEn && countEn == 0) {
					countRu++;
				}
				else if (controlChars[i] in enToRu) {
					countEn++;
				}
			};
			if (countRu == 3) {
				Array.from(selectedText).forEach(char => {
					if (char in ruToEn) {
						text = text + ruToEn[char]
					}
					else {
						text = text + char
					}
				});
			}
			else if (countEn == 3){
				Array.from(selectedText).forEach(char => {
					if (char in enToRu) {
						text = text + enToRu[char]
					}
					else {
						text = text + char
					}
				});
			}
			else {
				alert('The keyboard layout could not be determined (Available layouts: Ru, En)');
				alert('Use the "translate keyboard layout to EN/EN" commands')
				return;
			};
			
			editor.replaceSelection(`${text}`)
		}
	}

	TranslateBlockToRu(): void {
		let activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			let editor = activeView.editor;
			let selectedText = editor.getSelection();
			let text = '';
			Array.from(selectedText).forEach(char => {
				if (char in enToRu) {
					text = text + enToRu[char]
				}
				else {
					text = text + char
				}
			});
			
			editor.replaceSelection(`${text}`)
		}
	}

	TranslateBlockToEn(): void {
		let activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			let editor = activeView.editor;
			let selectedText = editor.getSelection();
			let text = '';
			Array.from(selectedText).forEach(char => {
				if (char in ruToEn) {
					text = text + ruToEn[char]
				}
				else {
					text = text + char
				}
			});
			
			editor.replaceSelection(`${text}`)
		}
	}
}