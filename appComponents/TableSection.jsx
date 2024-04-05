'use client';

import React, { useState } from 'react';
import TransitionScroll from '@/appComponents/transitionScroll/TransitionScroll';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, trickCol } from '@/lib/clientUtils';
import LinkWithArrow from '@/appComponents/common/LinkWithArrow';
import GenericTable from '@/appComponents/common/genericTable/GenericTable';
import { toast } from 'react-toastify';
import { useAsyncEffect } from '@/lib/customHooks';

function TableSection({ title, endpoint, columns, entityName, newLink, showCount = true, excludeActions = [] }) {
  const [tricks, setTricks] = useState(null);
  const actions = getCommonActions(endpoint, excludeActions);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall(endpoint, { method: 'GET' });
      setTricks(data);
    } catch (error) {
      toast.error(`Failed to fetch ${entityName}s: ${error.message}`);
    }
  }, []);

  const handleActions = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall(endpoint, { method: 'DELETE', id: obj._id });
          const { data } = await apiCall(endpoint, { method: 'GET' });
          setTricks(data);
          toast.success(`Successfully deleted ${obj.trick}`);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
    }
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
      <LinkWithArrow label={title} href={`/${endpoint}`} />
      <GenericTable
        objArray={tricks}
        columns={columns}
        actions={actions}
        entityName={entityName}
        newLink={newLink}
        onAction={handleActions}
        showCount={showCount}
      />
    </TransitionScroll>
  );
}

export default TableSection;
