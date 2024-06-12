#! /usr/bin/env node

import intro from './intro';
import ShowCommander from './commander';
import { PromptObject } from 'prompts';
import ShowPrompt, { ESLINT_QUESTION, LANGUAGE_QUESTION, NAME_QUESTION } from './prompts';
import clone, { DEFAULT, VANILLA } from './source';
import { log } from 'console';
import { basename } from 'path';
import { format } from './name';

intro()

let pattern: 'ts' | 'js' = 'ts'
let eslint: boolean = true
const questions: PromptObject[] = []
const commander = ShowCommander()

if (commander['typescript'])
    pattern = 'ts'
else if (commander['javascript'])
    pattern = 'js'
else
    questions.push(LANGUAGE_QUESTION)

if (commander['eslint'])
    eslint = true
else
    questions.push(ESLINT_QUESTION)

// Recommend package name
const packageName = NAME_QUESTION
packageName.initial = format(basename(process.cwd()))
questions.push(packageName)

ShowPrompt(questions)
    .then(async value => {
        if (!value.name) {
            log("Something is wrong, please try again.")
            return
        }
        if (value.language)
            pattern = value.language
        if (value.esline)
            eslint = value.esline
        let action: () => Promise<void>
        switch (pattern) {
            case 'ts':
                action = clone.bind(this, DEFAULT, value.name, commander['proxy'])
                break
            case 'js':
                action = clone.bind(this, VANILLA, value.name, commander['proxy'])
        }
        log("Wait a few minutes...")
        action().then(() => {
            log("We're done, enjoy!")
        })
    })