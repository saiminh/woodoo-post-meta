import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(
  {
    context: { postType, postId, queryId },
  }
) {
  const isDescendentOfQueryLoop = Number.isFinite( queryId );
  const { editEntityRecord } = useDispatch( coreStore );
  const { meta } = useSelect(
    ( select ) => {
      const { getEditedEntityRecord } =
      select( coreStore );
      const _meta = getEditedEntityRecord(
        'postType',
        postType,
        postId
        )?.meta;
      return {
        meta: _meta,
      };
    },
    [ postType, postId ]
  );

  if ( isDescendentOfQueryLoop && meta.site_externe ) {
    return (
      <div { ...useBlockProps( { className: 'external-link-container' }) }>
        <a className="external-link">
          <span className="external-link-words">Read more</span>
          <span className="external-link-arrow"> -&gt; </span>
        </a>
      </div>
    );
  }
  else if ( isDescendentOfQueryLoop && !meta.site_externe ) {
    return null
  }
  else {
    return (
      <div { ...useBlockProps( { className: 'external-link-container' }) }>
        <a className="external-link">
          <span className="external-link-words">Read more</span>
          <span className="external-link-arrow"> -&gt; </span>
        </a>
        <TextControl
          label="Set external link url:"
          value={ meta.site_externe }
          onChange={ ( newValue ) => {
            const newMeta = { ...meta, site_externe: newValue };
            editEntityRecord( 'postType', postType, postId, {
              meta: newMeta,
            } );
          } }
        />
      </div>
    );
  }
}
