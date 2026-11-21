// Холбоо барих — Wi-Fi / Cameras карт шиг. Дарахад имэйл, утас, GitHub, сошиал шууд нээгдэнэ.
import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Glass, IconCircle, SectionTitle, SwipeButton, T, Toggle, Stagger } from '../components/ui';
import { useTheme } from '../theme';
import { contacts, Contact as C, profile } from '../data/profile';

export default function Contact() {
  const { theme } = useTheme();
  const [available, setAvailable] = useState(true);
  const email = contacts.find((c) => c.id === 'mail');

  return (
    <Stagger>
      <SectionTitle kicker="Security & Access" title="Холбоо барих" />

      <Glass strong style={[styles.rowBetween, { marginBottom: 14 }]}>
        <View style={{ flex: 1 }}>
          <T size={16} weight="600">Дадлага / ажилд</T>
          <T size={13} muted>{available ? 'Нээлттэй — санал хүлээж байна' : 'Түр завгүй'}</T>
        </View>
        <Toggle value={available} onChange={setAvailable} />
      </Glass>

      <View style={styles.grid}>
        {contacts.map((c, i) => (
          <ContactCard key={c.id} c={c} full={contacts.length % 2 === 1 && i === contacts.length - 1} />
        ))}
      </View>

      <Glass style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Ionicons name="chatbubble-ellipses" size={22} color={theme.accent} />
          <T size={16} weight="700" style={{ marginLeft: 10 }}>Хурдан мессеж</T>
        </View>
        <T size={14} muted style={{ marginBottom: 16, lineHeight: 20 }}>
          Тоглоомын санаа, хамтын төсөл эсвэл зүгээр л мэндчилгээ — гулсуулаад имэйл бичээрэй.
        </T>
        {email && (
          <SwipeButton
            label="Имэйл бичих"
            icon="mail"
            onComplete={() => Linking.openURL(`${email.url}?subject=${encodeURIComponent('Сайн уу, ' + profile.nickname + '!')}`)}
          />
        )}
      </Glass>
    </Stagger>
  );
}

function ContactCard({ c, full }: { c: C; full?: boolean }) {
  const { theme } = useTheme();
  const [on, setOn] = useState(false);
  const open = () => {
    setOn(true);
    setTimeout(() => setOn(false), 1200);
    Linking.openURL(c.url).catch(() => {});
  };
  return (
    <View style={full ? { width: '100%' } : styles.cell}>
      <Glass onPress={open} style={{ minHeight: 160, justifyContent: 'space-between' }}>
        <View style={styles.rowBetween}>
          <Ionicons name={c.icon as any} size={26} color={on ? theme.accent : theme.text} />
          <IconCircle name="arrow-up-outline" size={32} />
        </View>
        <View>
          <T size={17} weight="700">{c.label}</T>
          <T size={12} muted numberOfLines={1}>{c.value}</T>
          <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
            <Toggle value={on} onChange={() => open()} />
          </View>
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  cell: { width: '48.5%' },
});
