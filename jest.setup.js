// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Workaround for TextEncoder issue in jsdom 16 - https://stackoverflow.com/a/68468204/84369
import { TextEncoder as encoder, TextDecoder as decoder } from 'util';
Object.assign(global, { TextDecoder: encoder, TextEncoder: decoder });
