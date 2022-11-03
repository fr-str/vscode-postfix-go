import * as vsc from 'vscode'
import { CompletionItemBuilder } from '../completionItemBuilder'
import { BaseExpressionTemplate } from './baseTemplates'

export class LenTemplate extends BaseExpressionTemplate {
  buildCompletionItem (code: string, position: vsc.Position) {
    const dotIdx = code.lastIndexOf('.', position.character)
    const codeBeforeDot = code.substr(0, dotIdx)
    let lastComponent = getLastComponent(codeBeforeDot)

    let builder = CompletionItemBuilder
      .create('len', lastComponent)
      .description(`len(expr)`)
    builder.insertText('len(' + lastComponent + ')')
    builder.deleteTextBeforeCursor(position, lastComponent.length + 1)

    return builder.build()
  }
}


export function getLastComponent (input: string): string {
  if (input.length === 0) { return '' }
  let lastComponent = ''
  // if (!input.endsWith(")") && input.includes("(")){
  //   input = input.substr(input.lastIndexOf("(")+1, input.length-1)
  // }
  let x = 0
  for (let i = 0; i < input.length; i++) {
    let character = input.substr(input.length - i - 1, 1)
    if (!character.match(/[a-zA-Z0-9\(\)\[\]\.]/) && x===0) {
      return lastComponent
    }
    
    if (character === ')' || character === ']'){
      x++
    }else if (character === '(' || character === '['){
      x--
      if (x<0){
        return lastComponent
      }
    }
    lastComponent = character + lastComponent
  }
  return lastComponent
}


export const build = () => new LenTemplate()