import Upload from './TusUpload';
import MultipleUpload from './MultipleUpload';

export default function CreateTask({ User }) {
  return (
    <div>
      <div>
        <h2>Upload Video</h2>
        <p>Upload your video here:</p>
        <Upload User={User} />
      </div>

      <div>
        <h2>Upload Resources</h2>
        <p>Upload your resources here:</p>
        <MultipleUpload User={User} />
      </div>
    </div>
  );
}