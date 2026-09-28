import DonationRequestsCards from '@/components/DashBoard/DonationRequestsCards';
import React from 'react';

const AdminMyDonationRequest = () => {
    return (
        <div>
            <DonationRequestsCards personalOnly={true}></DonationRequestsCards>
        </div>
    );
};

export default AdminMyDonationRequest;