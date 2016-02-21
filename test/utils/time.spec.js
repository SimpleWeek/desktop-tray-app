import { expect } from 'chai';
import { getTimeToSchedule } from '../../app/utils/time';

describe('utils', () => {
  describe('time', () => {
    it('should correctly return parsed time', () => {
      expect(getTimeToSchedule('00:00')).to.eql('00:00');
      expect(getTimeToSchedule('01:01')).to.eql('01:01');
      expect(getTimeToSchedule('23:59')).to.eql('23:59');
      expect(getTimeToSchedule('14:00')).to.eql('14:00');
    });

    it('should correctly validate incorrect time', () => {
      expect(getTimeToSchedule('00:-1')).to.eql(null);
      expect(getTimeToSchedule('24:00')).to.eql(null);
      expect(getTimeToSchedule('-1:00')).to.eql(null);
      expect(getTimeToSchedule('23:98')).to.eql(null);
    });

    it('should return null if text does not start with a time', () => {
      expect(getTimeToSchedule(' 00:00')).to.eql(null);
      expect(getTimeToSchedule('test 23:00')).to.eql(null);
      expect(getTimeToSchedule('-00:00')).to.eql(null);
      expect(getTimeToSchedule('test 23:00')).to.eql(null);
      expect(getTimeToSchedule('test')).to.eql(null);
    });
  });
});
