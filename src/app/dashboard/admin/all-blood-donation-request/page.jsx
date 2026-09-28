import DonationRequestsCards from '@/components/DashBoard/DonationRequestsCards';
import React from 'react';

const AdminAllBloodRequest = () => {
    return (
        <div>
            <DonationRequestsCards isAdmin={true} />
        </div>
    );
};

export default AdminAllBloodRequest;