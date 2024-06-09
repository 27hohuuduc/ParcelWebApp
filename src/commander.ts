import { OptionValues, program } from "commander"
import pkg from '../package.json'

export default function ShowCommander(): OptionValues {
    program
        .name(pkg.displayName)
        .description(pkg.description)
        .version(pkg.version)
        .option('-ts, --typescript', 'Apply Typescript pattern.', false)
        .option('-js, --javascript', 'Apply Javascript pattern.', false)
        .option('-e, --eslint', 'Apply ESLint configuration. (default no)', false)

    program.parse()

    return program.opts()
}