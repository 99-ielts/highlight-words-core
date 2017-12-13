import * as Chunks from './utils.js'
import expect from 'expect.js'
import latinize from 'latinize'

describe('utils', () => {
  // Positions: 01234567890123456789012345678901234567
  const TEXT = 'This is a string with words to search.'

  it('should handle empty or null textToHighlight', () => {
    let result = Chunks.findAll({
        searchWords: ['search'],
        textToHighlight: ''
    });
    expect(result.length).to.equal(0)

    result = Chunks.findAll({
        searchWords: ['search']
    });
    expect(result.length).to.equal(0)
  })

  it('should highlight all occurrences of a word, regardless of capitalization', () => {
    const rawChunks = Chunks.findChunks({
      searchWords: ['th'],
      textToHighlight: TEXT
    })
    expect(rawChunks).to.eql([
      {start: 0, end: 2},
      {start: 19, end: 21}
    ])
  })

  it('should highlight words that partially overlap', () => {
    const combinedChunks = Chunks.combineChunks({
      chunks: Chunks.findChunks({
        searchWords: ['thi', 'is'],
        textToHighlight: TEXT
      })
    })
    expect(combinedChunks).to.eql([
      {start: 0, end: 4},
      {start: 5, end: 7}
    ])
  })

  it('should combine into the minimum number of marked and unmarked chunks', () => {
    const filledInChunks = Chunks.findAll({
      searchWords: ['thi', 'is'],
      textToHighlight: TEXT
    })
    expect(filledInChunks).to.eql([
      {start: 0, end: 4, highlight: true},
      {start: 4, end: 5, highlight: false},
      {start: 5, end: 7, highlight: true},
      {start: 7, end: 38, highlight: false}
    ])
  })

  it('should handle unclosed parentheses when autoEscape prop is truthy', () => {
    const rawChunks = Chunks.findChunks({
      autoEscape: true,
      searchWords: ['text)'],
      textToHighlight: '(This is text)'
    })
    expect(rawChunks).to.eql([
      {start: 9, end: 14}
    ])
  })

  it('should match terms without accents against text with accents', () => {
    const rawChunks = Chunks.findChunks({
      sanitize: latinize,
      searchWords: ['example'],
      textToHighlight: 'ỆᶍǍᶆṔƚÉ'
    })
    expect(rawChunks).to.eql([
      {start: 0, end: 7}
    ])
  })

  it('should support case sensitive matches', () => {
    let rawChunks = Chunks.findChunks({
      caseSensitive: true,
      searchWords: ['t'],
      textToHighlight: TEXT
    })
    expect(rawChunks).to.eql([
      {start: 11, end: 12},
      {start: 19, end: 20},
      {start: 28, end: 29}
    ])

    rawChunks = Chunks.findChunks({
      caseSensitive: true,
      searchWords: ['T'],
      textToHighlight: TEXT
    })
    expect(rawChunks).to.eql([
      {start: 0, end: 1}
    ])
  })
})
