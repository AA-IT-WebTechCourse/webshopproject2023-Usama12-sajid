import moment from 'moment';

export function formatDate(timestamp) {
  return moment(timestamp).format('DD/MM/YYYY');
};