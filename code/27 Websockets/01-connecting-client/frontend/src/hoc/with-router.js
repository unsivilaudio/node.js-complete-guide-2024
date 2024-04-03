import { useNavigate, useParams } from 'react-router-dom';

export const withRouter = (WrappedComponent) => (props) => {
    const params = useParams();
    const navigate = useNavigate();

    return <WrappedComponent {...props} params={params} navigate={navigate} />;
};
