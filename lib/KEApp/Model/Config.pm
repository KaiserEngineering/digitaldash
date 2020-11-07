package KEApp::Model::Config;
use strict;
use warnings;

sub UpdateGauges {
  my $view = shift;
  my %args = (
    @_
  );

  # It ain't pretty but it will do as an MVP
  my $current_gauges = $view->{'gauges'} || [];

  my @gauges = ();
  my $i = 0;
  foreach my $pid ( @{ $args{'pid'} } ) {
      push @gauges, {
            %{@{$current_gauges}[$i]},
            "path" => "\/$view->{'theme'}\/",
            "pid"  => $args{"pid"}[$i]
      };
      $i = $i + 1;
  }
  delete $view->{"pid"};
  $view->{'gauges'} = \@gauges;
}

sub UpdateAlerts {
  my $view = shift;
  my %args = (
    @_
  );

  my ($i, @alerts) = (0, ());
  foreach my $message ( @{$args{'alertMessage'}} ) {
    push @alerts,
    {
      "message"  => $args{'alertMessage'}[$i],
      "op"       => $args{'alertOP'}[$i],
      "priority" => $args{'alertPriority'}[$i],
      "unit"     => $args{'alertUnit'}[$i],
      "value"    => $args{'alertValue'}[$i],
    };
    $i = $i + 1;
  }
  $view->{'alerts'} = \@alerts;
}

sub UpdateDynamic {
  my $view = shift;
  my %args = (
    @_
  );

  $view->{'dynamic'} = {
    "op"       => $args{'dynamicOP'},
    "priority" => $args{'dynamicPriority'},
    "unit"     => $args{'dynamicUnit'},
    "value"    => $args{'dynamicValue'},
    "pid"      => $args{'dynamicPID'},
  };
}

1;
