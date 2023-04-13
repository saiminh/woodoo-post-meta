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
                let newId;
                el.id ? newId = el.id.toString() : newId = 'Uploading...';
                updateMeta( {
                ...meta,
                filepdf: newId
              } )
            }
          }
          multiple = { false }
          labels = { { title: filepdf ? 'Attachment ID: ' + filepdf : 'No PDF', instructions: 'Upload or choose a PDF from the Media Library' } }
        >
        </MediaPlaceholder>
        <a className='remove-value' onClick={ () => {  updateMeta( { ...meta, filepdf: ''}) }}>Remove PDF</a>
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
          labels = { { title: file_video ? file_video : `No Video`, instructions: 'Upload or choose a video from the Media Library' } }
        >
        </MediaPlaceholder>
        <TextControl
          label="Or set external Video url:"
          value={ file_video }
          onChange={ ( newValue ) => {
            updateMeta( {
              ...meta,
              file_video: newValue
            } )
          } }
        />
        <a className='remove-value' onClick={ () => {  updateMeta( { ...meta, file_video: ''}) }}>Remove Video</a>
      </div>
    );
  }
}
