import { NamespaceObjSpec } from '../specs/namespace-types';
import fnName from '../utils/fnName';
import isPred from '../utils/isPred';
import isSpec from '../utils/isSpec';

function gen( registry ) {
  var conformedReg = NamespaceObjSpec.conform( registry );
  var docstr = _walk( null, null, conformedReg );
  return docstr;
}

function _walk( prefix, currentFrag, creg ) {
  let currentNs = prefix ? `${prefix}.${currentFrag}` : currentFrag;
  let r = '';
  let subresults = [];
  let nsComment,
    exprResult,
    subNamespaces;
  for ( let key in creg ) {
    if ( creg.hasOwnProperty( key ) ) {
      switch ( key ) {
      case 'subNamespaces' :
        subNamespaces = creg[ key ];
        for ( let subnamespace in subNamespaces ) {
          if ( subNamespaces.hasOwnProperty( subnamespace ) ) {
            let subresult = _walk( currentNs, subnamespace, subNamespaces[ subnamespace ] );
            subresults.push( subresult );
          }
        }
        break;
      case '.nsComment':
        nsComment = `<p><i>${creg[ key ]}</i></p>`;
        break;
      case '.meta':
        exprResult = _exprMeta( currentFrag, creg[ key ], creg[ '.expr' ] );
        break;
      default:
        break;
      }
    }
  }

  if ( exprResult ) {
    r += exprResult;
  }

  if ( currentNs && ( nsComment || _hasExprs( subNamespaces ) ) ) {
    r += `<h3>${currentNs}</h3><hr />`;
  }

  if ( nsComment ) {
    r += nsComment;
  }

  if ( subresults.length > 0 ) {
    r += subresults.join( '\n' );
  }

  return r;
}

function _hasExprs( subNamespaces ) {
  if ( !subNamespaces ) {
    return false;
  }
  return Object.keys( subNamespaces )
    .filter( ( n ) => subNamespaces[ n ][ '.expr' ] ).length > 0;
}

function _exprMeta( exprName, meta, expr ) {
  if ( !expr ) {
    throw new Error( `Expression ${exprName} does not exist in the registry` );
  }
  let docstr;
  docstr = genForExpression( exprName, expr, meta );
  return `
    ${docstr}
    `;
}

function _type( expr ) {
  if ( isSpec( expr ) ) {
    return expr.type;
  } else if ( isPred( expr ) ) {
    return `[Predicate] ${fnName( expr )}()`;
  }
}

function genForExpression( exprName, expr, meta ) {
  let docstr;
  if ( expr.type === 'FSPEC' ) {
    docstr = _genFspec( exprName, expr, meta );
  } else if ( expr.type === 'OR' ) {
    docstr = _genOrSpec( exprName, expr, meta );
  } else if ( expr.type === 'CAT' ) {
    docstr = _genCatSpec( exprName, expr, meta );
  } else if ( isPred( expr ) || expr.type === 'PRED' ) {
    docstr = _genPredSpec( exprName, expr, meta );
  } else {
    docstr = _genUnknownSpec( exprName, expr, meta );
  }

  return docstr;
}

function _genCatSpec( exprName, expr, meta ) {
  const altDefs = expr.exprs.map( ( { name, expr: altE }, idx ) => {
    const comment = meta && meta[ name ] && meta[ name ].comment;
    const example = meta && meta[ name ] && meta[ name ].example;
    return `
        <li class="list-group-item">
          ${name ? `<p>
            <span class="tag tag-default">${idx + 1}. </span>
            <span class="lead font-italic text-primary">
              <u>${name}</u>
            </span>
            ${comment ? `: <span>${ comment }</span>` : ''}
          </p>` : ''}
            ${_codeExample( example )}
            ${genForExpression( null, altE, null )}
        </li>
    `;
  } );

  const r = `
  <div class="card">
    <div class="card-block">
      <p class="card-title">
        <span class="tag tag-info">cat</span>
        A sequence of the following forms:
      </p>
    </div>
    <ol class="list-group list-group-flush">
      ${altDefs.join( '' )}
    </ol>
  </div>
  `;
  return r;
}

function _codeExample( code ) {
  const r = `${code ? `
    <blockquote class="blockquote">
      <pre><code class="js">${ code }</code></pre>
    </blockquote>` : ''}`
  return r;
}

function _genPredSpec( exprName, expr, meta ) {
  let pred = expr.exprs ? expr.exprs[ 0 ] : expr;
  const name = meta && meta[ 'name' ] || exprName;
  const predName = fnName( pred );
  const nameFrag = name ? `${name}: ` : '';
  const r = `
    <div class="card">
      <div class="card-header">
        <span
          data-toggle="popover"
          data-trigger="hover"
          data-html="true"
          title="${predName}()"
          data-content="<pre>${pred.toString()}</pre>"
          data-container="body"
          data-animation="false"
          >
          ${nameFrag}<em>${predName}()</em> <span class="tag tag-primary">predicate</span>
        </span>
      </div>
    </div>
  `;
  return r;
}

function _genUnknownSpec( exprName, expr, meta ) {
  const r = `
  <div class="card">
    <div class="card-header">
    ${exprName || _type( expr )} <div class="tag tag-success">spec</div>
    </div>
    <pre>${JSON.stringify( expr, null, 2 )}</pre>
    <pre>${JSON.stringify( meta, null, 2 )}</pre>
  </div>
  `;
  return r;
}

function _genOrSpec( exprName, expr, meta ) {
  const altDefs = expr.exprs.map( ( { name, expr: altE }, index ) => {
    const comment = meta && meta[ name ] && meta[ name ].comment;
    const example = meta && meta[ name ] && meta[ name ].example;

    return `
        <li class="list-group-item">
            ${name ? `<p>
                <span class="lead font-italic text-primary">
                  <u>${name}</u>
                </span>
                ${comment ? `: <span>${ comment }</span>` : ''}
              </p>` : ''}
              ${_codeExample( example )}
            ${genForExpression( null, altE, null )}
        </li>
    `;
  } );

  const r = `
  <div class="card">
    <div class="card-block">
      <p class="card-title">
        <span class="tag tag-info">or</span>
        One of the following forms:
      </p>
    </div>
    <ol class="list-group list-group-flush">
      ${altDefs.join( '' )}
    </ol>
  </div>
  `;
  return r;
}

// NOTE: meta param is omitted at the end
function _genFspec( exprName, spec, meta ) {
  var frags = [ ];
  const name = meta[ 'name' ] || exprName;
  const { args: argsSpec, ret: retSpec, fn } = spec.opts;
  if ( argsSpec ) {
    frags.push( [ 'Parameters', genForExpression( null, argsSpec, meta.args ) ] );
  }
  if ( retSpec ) {
    frags.push( [ 'Return value', genForExpression( null, retSpec, meta.ret ) ] );
  } if ( fn ) {
    frags.push( [ 'Argument-return value relation', `<pre>${fnName( fn )}</pre>` ] );
  }
  const r = `
    <div class="card">
      ${name ? `
        <div class="card-header">
          ${name}() <span class="tag tag-primary">function</span>
        </div>
        ` : ''}
      <div class="card-block">
        <dl>
        ${frags.map( ( [ name, src ] ) => `<dt>${name}</dt><dd>${src}</dd>` ).join( '\n' )}
        </dl>
      </div>
    </div>
  `;
  return r;
}


var fns = {
  gen,
  genForExpression,
};
module.exports = fns;
module.exports.default = fns;
