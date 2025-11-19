// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

export default (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched str
