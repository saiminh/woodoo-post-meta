import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaPlaceholder } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit(
  {
    context: { postType, postId, queryId },
  }
) {
  const isDescendentOfQueryLoop = Number.isFinite( queryId );

  const [ meta, updateMeta ] = useEntityProp(
    'postType',
    'post',
    'meta',
    postId
  );
  const { filepdf, file_video, site_externe } = meta;

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
          value={ site_externe }
          onChange={ ( newValue ) => {
            updateMeta( {
              ...meta,
              site_externe: newValue
            } )
          } }
        />
        <MediaPlaceholder
          key={1}
          icon={ 'pdf' }
          accept="application/pdf"
          allowedTypes={[ 'application/pdf' ]}
          onSelect = {
            ( el ) => {
                const newId = el.id.toString();
                updateMeta( {
                ...meta,
                filepdf: newId
              } )
            }
          }
          multiple = { false }
          labels = { { title: 'Attachment ID: ' + meta['filepdf'], instructions: 'Upload or choose a PDF from the Media Library' } }
        >
        </MediaPlaceholder>
        <a onClick={ () => {  updateMeta( { ...meta, filepdf: ''}) }}>Remove PDF</a>
        <MediaPlaceholder
          key={2}
          icon={ 'video-alt3' }
          allowedTypes={[ 'video/mp4' ]}
          onSelect = {
            ( newVideo ) => {
                updateMeta( {
                ...meta,
                file_video: newVideo.url
              } )
            }
          }
          multiple = { false }
          labels = { { title: meta['file_video'], instructions: 'Upload or choose a video from the Media Library' } }
        >
        </MediaPlaceholder>
        <a onClick={ () => {  updateMeta( { ...meta, file_video: ''}) }}>Remove Video</a>
      </div>
    );
  }
}
