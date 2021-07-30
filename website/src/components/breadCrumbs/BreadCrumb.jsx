import BrowserOnly from '@docusaurus/BrowserOnly'
import * as React from 'react'
import { Link } from 'react-router-dom'
import '../../css/breadcrumb.css'

const capitalize = str => {
  return str.replace(/^\w/, c => c.toUpperCase())
}

const Breadcrumb = () => {
  const [pathname, setPathname] = React.useState([])

  let intermediateRoutes = '/'

  return (
    <>
      <BrowserOnly>
        {() => {
          React.useEffect(() => {
            let temp = window.location.pathname.split('/')
            temp.unshift('Litmus Docs')
            setPathname(temp)
          }, [])
        }}
      </BrowserOnly>
      <div>
        {pathname.map((path, i) => {
          if (path) {
            intermediateRoutes += path !== 'Litmus Docs' ? path : ''
            const link = (
              <>
                {i < pathname.length - 1 ? (
                  <>
                    <Link
                      key={path}
                      style={{ color: '#6f6f6f' }}
                      to={{
                        pathname: intermediateRoutes
                      }}>
                      {capitalize(decodeURI(path))}
                    </Link>
                    <span className="arrow">{'>'}</span>
                  </>
                ) : (
                  <Link
                    key={path}
                    style={{ color: '#042a2b' }}
                    to={{
                      pathname: intermediateRoutes
                    }}>
                    {capitalize(decodeURI(path))}
                  </Link>
                )}
              </>
            )
            intermediateRoutes += '/'
            return link
          }
          return ''
        })}
      </div>
    </>
  )
}

export { Breadcrumb }
