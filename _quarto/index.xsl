<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  version="1.0"
>
    <xsl:output method="xml" />
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width" />
                <title><xsl:value-of select="rss/channel/title" /> (RSS)</title>
                <link href="/site_libs/quarto-html/tippy.css" rel="stylesheet"/>
                <link href="/site_libs/quarto-html/quarto-syntax-highlighting.css" rel="stylesheet" id="quarto-text-highlighting-styles"/>
                <script src="/site_libs/bootstrap/bootstrap.min.js"></script>
                <link href="/site_libs/bootstrap/bootstrap-icons.css" rel="stylesheet"/>
                <link href="/site_libs/bootstrap/bootstrap.min.css" rel="stylesheet" id="quarto-bootstrap" data-mode="light"/>
                <link rel="icon" href="/favicon.svg" />
            </head>
            <body class="nav-sidebar docked nav-fixed fullcontent quarto-light">
<header id="quarto-header" class="headroom fixed-top headroom--not-bottom headroom--not-top">
    <nav class="navbar navbar-expand-lg navbar-dark ">
      <div class="navbar-container container-fluid">
      <div class="navbar-brand-container">
    <a class="navbar-brand" href="https://blog.kdheepak.com/">
    <span class="navbar-title">Δ</span>
    </a>
  </div>
            <div id="quarto-search" class="type-overlay" title="Search"><div class="aa-Autocomplete" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="autocomplete-0-label"><button type="button" class="aa-DetachedSearchButton"><div class="aa-DetachedSearchButtonIcon"><svg class="aa-SubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg></div><div class="aa-DetachedSearchButtonPlaceholder">Search</div></button></div></div>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav navbar-nav-scroll ms-auto">
  <li class="nav-item compact">
    <a class="nav-link" href="https://github.com/kdheepak" rel="" target=""><i class="bi bi-github" role="img" aria-label="GitHub">
</i>
 <span class="menu-text"></span></a>
  </li>
</ul>
            <div class="quarto-navbar-tools">
</div>
          </div>
      </div>
    </nav>
</header>
<header id="title-block-header" class="quarto-title-block default toc-left page-columns page-full">
  <div class="quarto-title-banner page-columns page-full">
    <div class="quarto-title column-body">
      <h1 class="title">My personal thoughts and notes</h1>
                      </div>
  </div>
  <div class="quarto-title-meta">
      <div>
      <div class="quarto-title-meta-heading">Author</div>
      <div class="quarto-title-meta-contents">
               <p>Dheepak Krishnamurthy </p>
            </div>
      </div>
    </div>
  </header>
  <div class="quarto-container page-columns page-rows-contents page-layout-article page-navbar">
              <main class="content quarto-banner-title-block">
                <article>
                    <header>
                    <h1>
                        <abbr title="Really Simple Syndication">RSS</abbr> feed
                    </h1>
                    </header>
                    <section>
                        <p>You may use the <acronym
                title="Uniform Resource Locater"
              >URL</acronym> of this document or copy the address below and paste it for any RSS purposes.
                        <br />
                        <label for="address">RSS address: </label>
                        <input style="width:300px">
                            <xsl:attribute name="id">address</xsl:attribute>
                            <xsl:attribute name="spellcheck">false</xsl:attribute>
                            <xsl:attribute name="value">
                                <xsl:value-of select="rss/channel/atom:link[@rel='self']/@href" />
                            </xsl:attribute>
                        </input>
                        </p>
                        <p>New to feeds? You can find out more about the RSS file format at <a
                href="http://en.wikipedia.org/wiki/RSS_(file_format)"
              >Wikipedia's RSS entry</a> or by clicking <a
                target="_blank"
                href="https://duckduckgo.com/?q=how+to+get+started+with+rss+feeds"
              >here</a> to search on the web to learn more.</p>
                        <h3>Recent blogs:</h3>
                        <div class="quarto-listing quarto-listing-container-table">
                        <table class="quarto-listing-table table table-hover">
                          <tbody class="list">
                          <xsl:for-each select="rss/channel/item">
                            <tr>
                              <td>
                                <a>
                                    <xsl:attribute name="href"><xsl:value-of
                      select="link"
                    /></xsl:attribute><xsl:value-of select="title" />
                                </a>
                              </td>
                            </tr>
                          </xsl:for-each>
                          </tbody>
                        </table>
                        </div>
                    </section>
                </article>
              </main>
              </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
