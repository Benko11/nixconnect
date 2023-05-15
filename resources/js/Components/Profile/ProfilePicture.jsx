export default function ProfilePicture({size, path}) {
    return (
        <div style={{width: size, height: size, backgroundImage: `url(/storage/avatars/${path})`, backgroundSize: 'cover', backgroundPosition: '50% 50%'}}>

        </div>
    )
}
