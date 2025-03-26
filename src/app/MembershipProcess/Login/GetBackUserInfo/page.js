
import Loading2 from '@/Tools/Loading2';
import CheckUser from '@/Components/MembershipProcess/GetBackUserInfo/CheckUser';


const AuthCallback = () => {
    
    return (
        <div className='flex h-screen w-full justify-center items-center'>
            <Loading2 />
            <CheckUser />
        </div>
    );
};

export default AuthCallback;
