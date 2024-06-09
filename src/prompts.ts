import prompts, { PromptObject } from 'prompts'
import { check } from './name'

export const LANGUAGE_QUESTION: PromptObject = {
    type: 'select',
    name: 'language',
    message: 'Choose your language:',
    choices: [
        { title: 'Typescript', value: 'ts' },
        { title: 'Javascript', value: 'js' }
    ],
    initial: 0
}

export const ESLINT_QUESTION: PromptObject = {
    type: 'confirm',
    name: 'eslint',
    message: 'Would you like to apply ESLint? (in developing)',
    initial: true
}

export const NAME_QUESTION: PromptObject = {
    type: 'text',
    name: 'name',
    message: 'Project name:',
    validate: value => check(value) ? true : `${value} is invalid. Refer to https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name`
}

interface IResult {
    language: 'ts' | 'js',
    esline: boolean,
    name: string
}

export default async function ShowPrompt(questions: PromptObject[]) {
    return await prompts(questions) as IResult
}