import React, { Component } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

import '../../css/docs.css'

export const CodeBlock = ({ type, code, title }) => {
  // copyToClipboard(e) {
  // 	const el = e.target.parentElement.nextElementSibling
  // 	el.focus()
  // 	let range = document.createRange()
  // 	try {
  // 		range.selectNode(el)
  // 		const sel = window.getSelection()
  // 		sel.removeAllRanges()
  // 		sel.addRange(range)
  // 		document.execCommand('copy')
  // 		if (sel.removeRange) {
  // 			sel.removeRange(range)
  // 		} else {
  // 			sel.removeAllRanges()
  // 		}
  // 	} catch (err) {
  // 		console.error('Copy to Clipboar Error:', err)
  // 	}
  // }

  // render() {
  // 	const { title, type } = this.props
  // 	const code = this.props.code || ''

  return (
    <div className="code">
      <div className="titleGroup">
        <img src="../../../static/img/code_block_header.svg" alt="hii" />
        <div className="title">Terminal</div>

        <button className="copyBtn">
          <img src="../../../static/img/copy.svg" alt="hii" />
        </button>
      </div>
      <div className="coding">
        <Highlight {...defaultProps} className="line-numbers" theme={theme} code={code.trim()} language={type || 'js'}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className="line-numbers">
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}

// }
