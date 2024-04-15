// check if password contain special characters
export const containSpecialChar = (str: string, special_characters: Array<string>) => {
    return special_characters.some(char => str.includes(char))
}